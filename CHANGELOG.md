# Changelog

## Version 1.0.0 (Initial Release)

### Features
- **Automatic Partition Backup**: Backs up boot, init_boot (if present), and recovery partitions during module installation
- **Module State Management**: Records list of enabled modules and restores only those modules during recovery
  - During backup: Saves list of all currently enabled modules
  - During restore: Disables ALL modules first, then re-enables only the backed up modules
  - NoBricking module itself is never disabled to maintain protection
- **Boot Failure Detection**: Creates flag files on each boot attempt to track boot failures
- **Automatic Recovery**: After 3 consecutive failed boots, automatically restores backed up partitions and module configuration
- **Boot Success Monitoring**: Removes flag files after successful boot and /data decryption
- **Manual Backup Trigger**: Action button in Magisk/KSU Manager to create backups on-demand
- **Wide Compatibility**: Supports Magisk, KernelSU (original, Next), APatch, Sukisu Ultra, and other variants
- **A/B Partition Support**: Automatically detects and backs up the active slot
- **Comprehensive Logging**: Maintains detailed logs of all backup, restore, and boot operations

### Technical Details
- Backup storage: `/data/adb/nobricking_backups/`
- Flag file tracking in: `/data/adb/nobricking_backups/flags/`
- Automatic cleanup of flags after successful boot
- Smart partition detection for various device configurations
- Safe uninstallation with backup preservation option

### Safety Features
- Never disables itself during restore operations
- Preserves backups on module uninstallation
- Validates partition accessibility before operations
- Comprehensive error logging for troubleshooting
