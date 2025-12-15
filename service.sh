#!/system/bin/sh
# NoBricking Service Script - Runs on early boot

MODDIR="${0%/*}"
BACKUP_DIR="/data/adb/nobricking_backups"
FLAG_DIR="$BACKUP_DIR/flags"

# Wait for boot to be more stable
sleep 5

# Create timestamp flag file to indicate boot attempt
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FLAG_FILE="$FLAG_DIR/boot_${TIMESTAMP}.flag"

# Create flag directory if it doesn't exist
mkdir -p "$FLAG_DIR"

# Create the flag file
touch "$FLAG_FILE"
echo "Boot attempt at $TIMESTAMP" > "$FLAG_FILE"

# Log the boot attempt
echo "$(date): Boot attempt flag created: $FLAG_FILE" >> "$BACKUP_DIR/boot.log"

# Schedule boot completion check in background
(
    sleep 60
    sh "$MODDIR/boot-completed.sh"
) &
