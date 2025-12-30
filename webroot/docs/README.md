# NoBricking
No Bricking/不许变砖/文鎮化じゃダメ

A Magisk/KernelSU module that automatically protects your device from bricking by backing up critical partitions and restoring them if boot failures are detected.

## Features

- **Automatic Backup**: Backs up boot, init_boot (if present), and recovery partitions during installation
- **Module State Tracking**: Records enabled modules to restore them if needed
- **Boot Failure Detection**: Monitors boot attempts using flag files
- **Automatic Recovery**: Restores backups after 3 consecutive failed boot attempts
- **Manual Backup**: Trigger backups anytime via the action button in Magisk/KSU Manager
- **Wide Compatibility**: Supports Magisk, KernelSU, and variants (APatch, Sukisu Ultra, etc.)

## How It Works

### Boot Monitoring Process

1. **Early Boot (service.sh)**: Creates a flag file at the start of each boot attempt
2. **Boot Check (post-fs-data.sh)**: Counts existing flag files
   - If 3+ flags exist → Device is considered bricked → Restores backups automatically
   - If <3 flags → Normal boot continues
3. **Boot Complete (boot-completed.sh)**: After successful boot and /data decryption, removes all flag files

### Backup Process

The module backs up:
- **boot partition** (active slot)
- **init_boot partition** (if exists, for devices with separate init partition)
- **recovery partition** (if exists)
- **List of enabled modules** (to restore safe configuration)

Backups are stored in: `/data/adb/nobricking_backups/`

## Installation

1. Flash the module ZIP in Magisk/KernelSU Manager
2. Module automatically creates initial backups during installation
3. Reboot to activate protection

## Usage

### Automatic Protection
The module works automatically - no configuration needed. It will:
- Monitor every boot attempt
- Restore backups if 3 consecutive boot failures occur
- Clean up flags after successful boots

### Manual Backup
To create a backup at any time:
1. Open Magisk/KSU Manager
2. Go to Modules
3. Find "NoBricking"
4. Tap the Action button (gear/settings icon)
5. Module will backup current state

**Recommended**: Create manual backups before:
- Installing new modules
- Updating system
- Making kernel changes
- Flashing major modifications

## File Structure

```
/data/adb/nobricking_backups/
├── partitions/           # Partition backup images
│   ├── boot_a.img       # Boot partition backup
│   ├── init_boot_a.img  # Init_boot backup (if exists)
│   └── recovery.img     # Recovery backup (if exists)
├── modules/             # Module configuration
│   └── module_list.txt  # List of enabled modules
├── flags/               # Boot attempt tracking
│   └── boot_*.flag      # Flag files (auto-cleaned on success)
└── *.log                # Log files
```

## Compatibility

### Supported Root Solutions
- Magisk (all versions)
- KernelSU (original)
- KernelSU Next
- APatch
- Sukisu Ultra
- Other Magisk/KSU compatible solutions

### Supported Android Versions
- Android 10+
- Devices with A/B partitioning
- Devices with A-only partitioning

## Safety Notes

⚠️ **Important Considerations**:

1. **Backup Storage**: Backups are stored in `/data/adb/` - if `/data` is corrupted, backups may be inaccessible
2. **First Backup**: The module creates a backup during installation - ensure your system is working properly before installing
3. **Manual Backups**: Always create manual backups before risky operations
4. **Space Requirements**: Ensure sufficient free space in `/data` (typically 100-200MB needed)

## Troubleshooting

### Module doesn't restore backups
- Check if backups exist: `ls -la /data/adb/nobricking_backups/partitions/`
- Check logs: `cat /data/adb/nobricking_backups/*.log`
- Ensure module has proper permissions

### Boot flags not clearing
- Check if boot-completed.sh is running
- Verify /data is being decrypted properly
- Check boot.log for details

### Manual backup fails
- Ensure sufficient space in /data
- Check if partitions are accessible
- Try running from terminal: `su -c sh /data/adb/modules/nobricking/action.sh`

## Logs

The module maintains several log files in `/data/adb/nobricking_backups/`:
- `boot.log` - Boot attempt tracking
- `backup.log` - Backup operations
- `restore.log` - Restore operations
- `uninstall.log` - Uninstallation record

## Uninstallation

1. Remove module from Magisk/KSU Manager
2. Reboot
3. Backups are preserved in `/data/adb/nobricking_backups/`
4. Manually delete backup directory if no longer needed

## Technical Details

### Boot Failure Detection Logic
```
Boot Attempt → Create Flag File
    ↓
Count Flags < 3 → Continue Boot
    ↓
Boot Success → Remove All Flags
    
OR

Count Flags ≥ 3 → Restore Backups → Reboot
```

### Partition Detection
The module automatically detects:
- Active slot (A/B devices)
- Partition locations using multiple methods
- Device-specific partition naming

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is open source. See LICENSE file for details.

## Credits

Created by cyanmint

## Disclaimer

This module is provided as-is without warranty. While it aims to prevent bricking, always:
- Keep backups of important data
- Know how to access recovery mode
- Understand the risks of modifying system partitions

The authors are not responsible for any damage to your device.
