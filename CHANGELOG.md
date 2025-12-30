# Changelog

## Version 1.0.3

### Changes
- **Simplified module directory detection**: Always use `/data/adb/modules` path
  - All modern root solutions (Magisk, KernelSU, KSU Next, Sukisu Ultra, APatch) now use the standard `/data/adb/modules` path
  - Removed conditional directory detection logic for cleaner, more reliable code
  - No more need to check for `/data/adb/ksu/modules` as all KSU variants have standardized

## Version 1.0.2

### Bug Fixes
- **Fixed KernelSU compatibility**: Module now works correctly with KernelSU, KSU Next, Sukisu Ultra, and other KSU variants
- Changed runtime KSU detection from environment variable check to directory-based detection
  - Now checks for `/data/adb/ksu/modules` directory existence instead of `$KSU` variable
  - `$KSU` variable is only available during installation, not at runtime
  - Module now correctly backs up and restores modules in KSU environment

## Version 1.0.1

### Bug Fixes
- Removed WebUI to fix KSU installation errors
- WebUI will be re-added in a future release with proper KSU integration

## Version 1.1.0

### New Features (REMOVED in 1.0.1 due to installation issues)
- **Web UI for KSU**: Added intuitive web-based management interface for KernelSU users
  - Real-time status monitoring (boot flags, backup information)
  - One-click backup creation
  - Manual flag clearing
  - Backup restore with confirmation
  - Activity logging
  - Responsive design for mobile and desktop
- Integrated with KernelSU's built-in WebUI system (no separate HTTP server required)

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
