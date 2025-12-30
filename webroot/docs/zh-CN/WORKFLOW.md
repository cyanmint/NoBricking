# NoBricking Module Workflow

## Boot Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         DEVICE BOOT                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  SERVICE.SH (Early Boot)                                         │
│  - Create flag file: boot_TIMESTAMP.flag                        │
│  - Schedule boot-completed.sh                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  POST-FS-DATA.SH (Post FileSystem Mount)                        │
│  - Count flag files                                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    │                   │
              FLAG < 3            FLAG >= 3
                    │                   │
                    ↓                   ↓
      ┌──────────────────┐   ┌─────────────────────┐
      │ CONTINUE BOOT    │   │ RESTORE BACKUPS     │
      └──────────────────┘   └─────────────────────┘
                    │                   │
                    ↓                   ↓
      ┌──────────────────┐   ┌─────────────────────┐
      │ SYSTEM FULLY     │   │ 1. Restore boot     │
      │ BOOTS            │   │ 2. Restore init_boot│
      └──────────────────┘   │ 3. Restore recovery │
                    │         │ 4. Disable ALL mods │
                    ↓         │ 5. Enable ONLY from │
      ┌──────────────────┐   │    backup list      │
      │ USER UNLOCKS     │   │ 6. REBOOT           │
      │ /data            │   └─────────────────────┘
      └──────────────────┘
                    ↓
      ┌──────────────────┐
      │ BOOT-COMPLETED.SH│
      │ - Remove all flags│
      └──────────────────┘
                    ↓
      ┌──────────────────┐
      │ SUCCESS - FLAGS  │
      │ CLEARED          │
      └──────────────────┘
```

## Backup Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   BACKUP TRIGGER                                 │
│  - Installation: customize.sh                                    │
│  - Manual: Action button in Manager                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  ACTION.SH                                                       │
│  1. Detect active slot (A/B devices)                            │
│  2. Backup boot partition                                       │
│  3. Backup init_boot partition (if exists)                      │
│  4. Backup recovery partition (if exists)                       │
│  5. Scan module directory                                       │
│  6. Save list of ENABLED modules only                           │
│     (no disable file and no remove file)                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  BACKUP STORAGE: /data/adb/nobricking_backups/                  │
│  ├── partitions/                                                │
│  │   ├── boot_a.img                                            │
│  │   ├── init_boot_a.img                                       │
│  │   └── recovery.img                                          │
│  └── modules/                                                   │
│      └── module_list.txt (enabled modules only)                │
└─────────────────────────────────────────────────────────────────┘
```

## Module State Restoration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  RESTORE TRIGGERED (3+ boot failures)                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Restore Partitions                                     │
│  - boot partition → /dev/block/boot_X                           │
│  - init_boot partition → /dev/block/init_boot_X                 │
│  - recovery partition → /dev/block/recovery                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: Reset Module States                                    │
│  - Iterate through ALL modules                                  │
│  - Create "disable" file for each module                        │
│  - EXCEPT: nobricking itself (never disabled)                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: Re-enable Safe Modules                                 │
│  - Read module_list.txt (backed up enabled modules)             │
│  - For each module in the list:                                 │
│    • Remove "disable" file                                      │
│    • Module will be enabled on next boot                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  RESULT: Safe Configuration Restored                             │
│  ✓ Known-good partitions                                        │
│  ✓ Only previously working modules enabled                      │
│  ✓ Problematic modules remain disabled                          │
└─────────────────────────────────────────────────────────────────┘
```

## Key Features

### Module State Management
- **Backup**: Only saves modules that are currently enabled (no `disable` or `remove` file)
- **Restore**: 
  1. Disables ALL modules first (creates `disable` file)
  2. Re-enables ONLY modules from backup list (removes `disable` file)
  3. NoBricking itself is never disabled for safety
- **Purpose**: Ensures only known-good module configuration is restored

### Flag-based Boot Tracking
- Flag created: `service.sh` at early boot
- Flag checked: `post-fs-data.sh` before mounting
- Flag cleared: `boot-completed.sh` after successful /data unlock
- Threshold: 3 flags = device is bricked → restore

### Partition Support
- **boot**: Always backed up (active slot on A/B devices)
- **init_boot**: Backed up if exists (Android 13+ GKI devices)
- **recovery**: Backed up if exists (not present on some devices)
- **A/B slot detection**: Automatic via `ro.boot.slot_suffix` property
