#!/system/bin/sh
# NoBricking Uninstall Script

MODDIR="${0%/*}"
BACKUP_DIR="/data/adb/nobricking_backups"

# Ask user if they want to keep backups
echo "NoBricking module is being uninstalled."
echo "Backup directory: $BACKUP_DIR"
echo ""
echo "To keep your backups, the backup directory will NOT be deleted."
echo "You can manually delete it at: $BACKUP_DIR"

# Log uninstallation
if [ -d "$BACKUP_DIR" ]; then
    echo "$(date): Module uninstalled, backups preserved" >> "$BACKUP_DIR/uninstall.log"
fi
