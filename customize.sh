#!/system/bin/sh
# NoBricking Module Installation Script

SKIPUNZIP=1
MODPATH="${0%/*}"

# Detect Magisk/KSU
if [ -n "$KSU" ]; then
    ui_print "- KernelSU detected"
    MODTYPE="KSU"
elif [ -n "$MAGISK_VER_CODE" ]; then
    ui_print "- Magisk detected"
    MODTYPE="MAGISK"
else
    ui_print "! Neither Magisk nor KernelSU detected"
    abort "! Installation failed"
fi

ui_print "- Installing NoBricking Module"
ui_print "- Version: 1.0.3"

# Extract module files
ui_print "- Extracting module files"
unzip -o "$ZIPFILE" -d $MODPATH >&2

# Set permissions
ui_print "- Setting permissions"
set_perm_recursive $MODPATH 0 0 0755 0644
set_perm $MODPATH/service.sh 0 0 0755
set_perm $MODPATH/post-fs-data.sh 0 0 0755
set_perm $MODPATH/action.sh 0 0 0755
set_perm $MODPATH/uninstall.sh 0 0 0755
set_perm $MODPATH/boot-completed.sh 0 0 0755

# Create backup directory
BACKUP_DIR="/data/adb/nobricking_backups"
mkdir -p "$BACKUP_DIR"
mkdir -p "$BACKUP_DIR/flags"
mkdir -p "$BACKUP_DIR/partitions"
mkdir -p "$BACKUP_DIR/modules"

ui_print "- Backup directory: $BACKUP_DIR"

# Perform initial backup
ui_print "- Creating initial backup"
sh $MODPATH/action.sh install

ui_print "- Installation complete"
ui_print "- NoBricking will monitor boot status"
ui_print "- After 3 failed boots, backups will be restored"
