#!/system/bin/sh
# NoBricking Action Button Script
# This script runs when the action button is clicked in Magisk/KSU Manager
# It performs a manual backup of partitions and module list

MODDIR="${0%/*}"
BACKUP_DIR="/data/adb/nobricking_backups"

# Function to get active slot
get_active_slot() {
    local slot=$(getprop ro.boot.slot_suffix)
    if [ -z "$slot" ]; then
        slot=$(getprop ro.boot.slot)
        if [ -n "$slot" ]; then
            slot="_${slot}"
        fi
    fi
    echo "$slot"
}

# Function to find partition
find_partition() {
    local part_name=$1
    local part=$(find /dev/block -name "$part_name" 2>/dev/null | head -n1)
    if [ -z "$part" ]; then
        part=$(find /dev/block/by-name -name "$part_name" 2>/dev/null | head -n1)
    fi
    echo "$part"
}

# Function to find boot partition with fallback logic
find_boot_partition() {
    local slot=$1
    local part_type=$2  # "boot" or "init_boot"
    
    # Try with slot suffix first
    local part=$(find_partition "${part_type}${slot}")
    
    # Fallback to _a suffix
    if [ -z "$part" ]; then
        part=$(find_partition "${part_type}_a")
    fi
    
    # Fallback to no suffix (non-A/B device or recovery)
    if [ -z "$part" ]; then
        part=$(find_partition "${part_type}")
    fi
    
    echo "$part"
}

# Function to perform backup
perform_backup() {
    echo "Starting backup process..."
    
    SLOT=$(get_active_slot)
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    
    mkdir -p "$BACKUP_DIR/partitions"
    mkdir -p "$BACKUP_DIR/modules"
    
    # Backup boot partition
    BOOT_PART=$(find_boot_partition "$SLOT" "boot")
    
    if [ -n "$BOOT_PART" ] && [ -b "$BOOT_PART" ]; then
        echo "Backing up boot partition from $BOOT_PART"
        # Check available space
        PART_SIZE=$(blockdev --getsize64 "$BOOT_PART" 2>/dev/null || echo "0")
        if [ "$PART_SIZE" -gt 0 ]; then
            dd if="$BOOT_PART" of="$BACKUP_DIR/partitions/boot${SLOT}.img" bs=4096 conv=fsync 2>&1
            if [ $? -eq 0 ]; then
                sync
                echo "Boot partition backed up successfully"
            else
                echo "Failed to backup boot partition"
            fi
        else
            echo "Unable to determine boot partition size"
        fi
    else
        echo "Boot partition not found or not accessible"
    fi
    
    # Backup init_boot partition (if it exists)
    INIT_BOOT_PART=$(find_boot_partition "$SLOT" "init_boot")
    
    if [ -n "$INIT_BOOT_PART" ] && [ -b "$INIT_BOOT_PART" ]; then
        echo "Backing up init_boot partition from $INIT_BOOT_PART"
        # Check available space
        PART_SIZE=$(blockdev --getsize64 "$INIT_BOOT_PART" 2>/dev/null || echo "0")
        if [ "$PART_SIZE" -gt 0 ]; then
            dd if="$INIT_BOOT_PART" of="$BACKUP_DIR/partitions/init_boot${SLOT}.img" bs=4096 conv=fsync 2>&1
            if [ $? -eq 0 ]; then
                sync
                echo "Init_boot partition backed up successfully"
            else
                echo "Failed to backup init_boot partition"
            fi
        else
            echo "Unable to determine init_boot partition size"
        fi
    else
        echo "Init_boot partition not found (may not exist on this device)"
    fi
    
    # Backup recovery partition
    RECOVERY_PART=$(find_partition "recovery")
    if [ -n "$RECOVERY_PART" ] && [ -b "$RECOVERY_PART" ]; then
        echo "Backing up recovery partition from $RECOVERY_PART"
        # Check available space
        PART_SIZE=$(blockdev --getsize64 "$RECOVERY_PART" 2>/dev/null || echo "0")
        if [ "$PART_SIZE" -gt 0 ]; then
            dd if="$RECOVERY_PART" of="$BACKUP_DIR/partitions/recovery.img" bs=4096 conv=fsync 2>&1
            if [ $? -eq 0 ]; then
                sync
                echo "Recovery partition backed up successfully"
            else
                echo "Failed to backup recovery partition"
            fi
        else
            echo "Unable to determine recovery partition size"
        fi
    else
        echo "Recovery partition not found (may not exist on this device)"
    fi
    
    # Backup enabled modules list
    echo "Backing up enabled modules list"
    if [ -n "$KSU" ]; then
        MODULE_DIR="/data/adb/ksu/modules"
    else
        MODULE_DIR="/data/adb/modules"
    fi
    
    > "$BACKUP_DIR/modules/module_list.txt"
    
    for mod in "$MODULE_DIR"/*; do
        if [ -d "$mod" ]; then
            modname=$(basename "$mod")
            # Check if module is enabled (no disable file)
            if [ ! -f "$mod/disable" ] && [ ! -f "$mod/remove" ]; then
                echo "$modname" >> "$BACKUP_DIR/modules/module_list.txt"
            fi
        fi
    done
    
    echo "Module list backed up: $(cat "$BACKUP_DIR/modules/module_list.txt" | wc -l) modules"
    
    # Log the backup
    echo "$(date): Manual backup completed" >> "$BACKUP_DIR/backup.log"
    echo "Backup timestamp: $TIMESTAMP" >> "$BACKUP_DIR/backup.log"
    
    echo "Backup completed successfully!"
}

# Main execution
if [ "$1" = "install" ]; then
    echo "Performing initial backup during installation..."
    perform_backup
else
    # Called from action button
    perform_backup
fi
