#!/system/bin/sh
# NoBricking Post-FS-Data Script - Runs early in boot process

MODDIR="${0%/*}"
BACKUP_DIR="/data/adb/nobricking_backups"
FLAG_DIR="$BACKUP_DIR/flags"
RESTORE_FLAG="$BACKUP_DIR/.restore_attempted"

# Function to count flag files
count_flags() {
    if [ -d "$FLAG_DIR" ]; then
        ls -1 "$FLAG_DIR"/*.flag 2>/dev/null | wc -l
    else
        echo "0"
    fi
}

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

# Function to restore backups
restore_backups() {
    echo "$(date): Starting restore process" >> "$BACKUP_DIR/restore.log"
    
    SLOT=$(get_active_slot)
    
    # Restore boot partition
    if [ -f "$BACKUP_DIR/partitions/boot${SLOT}.img" ]; then
        echo "$(date): Restoring boot partition" >> "$BACKUP_DIR/restore.log"
        # Find boot partition - handle both A/B and non-A/B devices
        if [ -n "$SLOT" ]; then
            BOOT_PART=$(find /dev/block -name "boot${SLOT}" -o -name "boot_[ab]" 2>/dev/null | grep "${SLOT}" | head -n1)
            if [ -z "$BOOT_PART" ]; then
                BOOT_PART=$(find /dev/block/by-name -name "boot${SLOT}" -o -name "boot_[ab]" 2>/dev/null | grep "${SLOT}" | head -n1)
            fi
        else
            # Non-A/B device
            BOOT_PART=$(find /dev/block -name "boot" 2>/dev/null | head -n1)
            if [ -z "$BOOT_PART" ]; then
                BOOT_PART=$(find /dev/block/by-name -name "boot" 2>/dev/null | head -n1)
            fi
        fi
        if [ -n "$BOOT_PART" ] && [ -b "$BOOT_PART" ]; then
            dd if="$BACKUP_DIR/partitions/boot${SLOT}.img" of="$BOOT_PART" bs=4096 conv=fsync
            if [ $? -eq 0 ]; then
                sync
                echo "$(date): Boot partition restored successfully to $BOOT_PART" >> "$BACKUP_DIR/restore.log"
            else
                echo "$(date): ERROR: Failed to restore boot partition" >> "$BACKUP_DIR/restore.log"
            fi
        fi
    fi
    
    # Restore init_boot partition if exists
    if [ -f "$BACKUP_DIR/partitions/init_boot${SLOT}.img" ]; then
        echo "$(date): Restoring init_boot partition" >> "$BACKUP_DIR/restore.log"
        # Find init_boot partition - handle both A/B and non-A/B devices
        if [ -n "$SLOT" ]; then
            INIT_BOOT_PART=$(find /dev/block -name "init_boot${SLOT}" -o -name "init_boot_[ab]" 2>/dev/null | grep "${SLOT}" | head -n1)
            if [ -z "$INIT_BOOT_PART" ]; then
                INIT_BOOT_PART=$(find /dev/block/by-name -name "init_boot${SLOT}" -o -name "init_boot_[ab]" 2>/dev/null | grep "${SLOT}" | head -n1)
            fi
        else
            # Non-A/B device
            INIT_BOOT_PART=$(find /dev/block -name "init_boot" 2>/dev/null | head -n1)
            if [ -z "$INIT_BOOT_PART" ]; then
                INIT_BOOT_PART=$(find /dev/block/by-name -name "init_boot" 2>/dev/null | head -n1)
            fi
        fi
        if [ -n "$INIT_BOOT_PART" ] && [ -b "$INIT_BOOT_PART" ]; then
            dd if="$BACKUP_DIR/partitions/init_boot${SLOT}.img" of="$INIT_BOOT_PART" bs=4096 conv=fsync
            if [ $? -eq 0 ]; then
                sync
                echo "$(date): Init_boot partition restored successfully to $INIT_BOOT_PART" >> "$BACKUP_DIR/restore.log"
            else
                echo "$(date): ERROR: Failed to restore init_boot partition" >> "$BACKUP_DIR/restore.log"
            fi
        fi
    fi
    
    # Restore recovery partition (can be A/B on some devices)
    if [ -f "$BACKUP_DIR/partitions/recovery${SLOT}.img" ]; then
        echo "$(date): Restoring recovery partition" >> "$BACKUP_DIR/restore.log"
        # Find recovery partition - handle both A/B and non-A/B devices
        if [ -n "$SLOT" ]; then
            RECOVERY_PART=$(find /dev/block -name "recovery${SLOT}" -o -name "recovery_[ab]" 2>/dev/null | grep "${SLOT}" | head -n1)
            if [ -z "$RECOVERY_PART" ]; then
                RECOVERY_PART=$(find /dev/block/by-name -name "recovery${SLOT}" -o -name "recovery_[ab]" 2>/dev/null | grep "${SLOT}" | head -n1)
            fi
        else
            # Non-A/B device
            RECOVERY_PART=$(find /dev/block -name "recovery" 2>/dev/null | head -n1)
            if [ -z "$RECOVERY_PART" ]; then
                RECOVERY_PART=$(find /dev/block/by-name -name "recovery" 2>/dev/null | head -n1)
            fi
        fi
        if [ -n "$RECOVERY_PART" ] && [ -b "$RECOVERY_PART" ]; then
            dd if="$BACKUP_DIR/partitions/recovery${SLOT}.img" of="$RECOVERY_PART" bs=4096 conv=fsync
            if [ $? -eq 0 ]; then
                sync
                echo "$(date): Recovery partition restored successfully to $RECOVERY_PART" >> "$BACKUP_DIR/restore.log"
            else
                echo "$(date): ERROR: Failed to restore recovery partition" >> "$BACKUP_DIR/restore.log"
            fi
        fi
    fi
    
    # Restore module list
    if [ -f "$BACKUP_DIR/modules/module_list.txt" ]; then
        echo "$(date): Restoring module states" >> "$BACKUP_DIR/restore.log"
        
        # All modern root solutions (Magisk, KSU, KSU Next, Sukisu Ultra, APatch) use /data/adb/modules
        MODULE_DIR="/data/adb/modules"
        
        # Create disable files for all modules except nobricking
        if [ -d "$MODULE_DIR" ]; then
            for mod in "$MODULE_DIR"/*; do
                if [ -d "$mod" ]; then
                    modname=$(basename "$mod")
                    if [ "$modname" != "nobricking" ]; then
                        touch "$mod/disable"
                    fi
                fi
            done
        fi
        
        # Re-enable modules from backup list
        while IFS= read -r modname; do
            if [ -d "$MODULE_DIR/$modname" ]; then
                rm -f "$MODULE_DIR/$modname/disable"
                echo "$(date): Enabled module: $modname" >> "$BACKUP_DIR/restore.log"
            fi
        done < "$BACKUP_DIR/modules/module_list.txt"
    fi
    
    # Mark that restore was attempted
    touch "$RESTORE_FLAG"
    echo "$(date): Restore process completed" >> "$BACKUP_DIR/restore.log"
    
    # Clear all flags after restore
    rm -f "$FLAG_DIR"/*.flag
    
    # Reboot to apply changes
    echo "$(date): Rebooting device" >> "$BACKUP_DIR/restore.log"
    reboot
}

# Main logic
mkdir -p "$FLAG_DIR"

# Check if restore was already attempted
if [ -f "$RESTORE_FLAG" ]; then
    echo "$(date): Restore already attempted, skipping" >> "$BACKUP_DIR/boot.log"
    # Remove restore flag after one successful boot
    rm -f "$RESTORE_FLAG"
    exit 0
fi

# Count existing flags
FLAG_COUNT=$(count_flags)
echo "$(date): Flag count: $FLAG_COUNT" >> "$BACKUP_DIR/boot.log"

# If 3 or more flags exist, restore backups
if [ "$FLAG_COUNT" -ge 3 ]; then
    echo "$(date): CRITICAL: 3+ boot failures detected!" >> "$BACKUP_DIR/boot.log"
    restore_backups
fi
