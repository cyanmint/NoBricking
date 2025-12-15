#!/system/bin/sh
# NoBricking Boot Complete Script
# Runs after system fully boots and /data is decrypted

MODDIR="${0%/*}"
BACKUP_DIR="/data/adb/nobricking_backups"
FLAG_DIR="$BACKUP_DIR/flags"

# Wait for system to be fully ready
sleep 10

# Function to check if /data is decrypted and accessible
is_data_decrypted() {
    # Check if we can write to /data
    if touch /data/.nobricking_test 2>/dev/null; then
        rm -f /data/.nobricking_test
        return 0
    fi
    return 1
}

# Wait for /data to be decrypted (max 10 minutes for slower devices)
MAX_WAIT=120
WAIT_COUNT=0
while ! is_data_decrypted; do
    sleep 5
    WAIT_COUNT=$((WAIT_COUNT + 1))
    if [ $WAIT_COUNT -ge $MAX_WAIT ]; then
        echo "$(date): Timeout waiting for /data decrypt, will retry on next boot" >> "$BACKUP_DIR/boot.log"
        # Don't exit with error, just log and return - flags will persist for next attempt
        exit 0
    fi
done

# Check if boot was successful by checking if we can access /data
if is_data_decrypted; then
    # Remove all flag files as boot was successful
    if [ -d "$FLAG_DIR" ]; then
        rm -f "$FLAG_DIR"/*.flag
        echo "$(date): Boot successful, flags cleared" >> "$BACKUP_DIR/boot.log"
    fi
fi
