# Build Instructions

## Creating the Module ZIP

To create a flashable ZIP for Magisk/KernelSU:

### Recommended Method: Manual ZIP with Required Files Only

```bash
# Create ZIP with ONLY the necessary module files
zip -r NoBricking.zip \
    module.prop \
    customize.sh \
    service.sh \
    post-fs-data.sh \
    action.sh \
    boot-completed.sh \
    uninstall.sh \
    update.json
```

**Important:** Do NOT include documentation files (README.md, BUILD.md, CHANGELOG.md, etc.) in the module ZIP as they can interfere with KSU module detection.

### Alternative: Using excludes

```bash
# On Linux/macOS - exclude documentation and git files
zip -r NoBricking.zip . \
    -x '*.git*' \
    -x '.gitignore' \
    -x 'README.md' \
    -x 'CHANGELOG.md' \
    -x 'SECURITY.md' \
    -x 'WORKFLOW.md' \
    -x 'BUILD.md' \
    -x 'IMPLEMENTATION.md'
```

## Required Files in ZIP

The module ZIP **must** contain:
- `module.prop` - Module metadata
- `customize.sh` - Installation script
- `service.sh` - Boot service script
- `post-fs-data.sh` - Early boot script
- `action.sh` - Action button handler
- `boot-completed.sh` - Boot completion checker
- `uninstall.sh` - Cleanup script

Optional but recommended:
- `README.md` - User documentation

## File Permissions

The ZIP should contain files with appropriate permissions:
- Scripts (*.sh): 0755 (executable)
- Module.prop: 0644 (readable)
- README.md: 0644 (readable)

Note: Permissions are set during installation by `customize.sh`, so ZIP permissions are not critical.

## Testing the Module

### Before distributing:

1. **Verify ZIP structure:**
   ```bash
   unzip -l NoBricking.zip
   ```

2. **Check module.prop format:**
   ```bash
   unzip -p NoBricking.zip module.prop
   ```

3. **Verify script syntax:**
   ```bash
   for script in customize.sh service.sh post-fs-data.sh action.sh boot-completed.sh uninstall.sh; do
       unzip -p NoBricking.zip $script | sh -n
   done
   ```

### Installation testing (on device):

1. Flash the ZIP in Magisk/KSU Manager
2. Check installation logs for errors
3. Reboot and verify module is active
4. Check logs: `cat /data/adb/nobricking_backups/*.log`
5. Test action button for manual backup
6. Verify backups created: `ls -lh /data/adb/nobricking_backups/partitions/`

### Safety testing:

⚠️ **WARNING**: Only test on a device you can recover!

1. Create manual backup first (action button)
2. Test normal boot (flags should be cleared)
3. Test flag accumulation (check `/data/adb/nobricking_backups/flags/`)
4. Verify flag cleanup after successful boot

## Troubleshooting Build Issues

### ZIP doesn't install
- Check that all required files are present
- Verify `customize.sh` is at root of ZIP (not in subdirectory)
- Ensure `module.prop` has correct format

### Scripts don't execute
- Verify shebang (`#!/system/bin/sh`) is present
- Check for Windows line endings (use `dos2unix` if needed)
- Ensure no syntax errors with `sh -n script.sh`

### Module doesn't appear in Magisk/KSU
- Check `module.prop` has valid ID (no spaces, lowercase)
- Verify `id=` matches module directory name that gets created
- Check Magisk/KSU Manager logs for errors

## Release Checklist

Before releasing a new version:

- [ ] Update version number in `module.prop`
- [ ] Update `versionCode` in `module.prop` (increment by 1)
- [ ] Update `CHANGELOG.md` with changes
- [ ] Update `update.json` with new version info
- [ ] Test installation on clean device
- [ ] Test upgrade from previous version
- [ ] Verify all scripts have correct syntax
- [ ] Test backup creation
- [ ] Test action button
- [ ] Create git tag: `git tag v1.0.0`
- [ ] Build release ZIP
- [ ] Create GitHub release with ZIP attachment
- [ ] Update README if needed

## Version History

- v1.0.0 - Initial release
  - Boot failure detection
  - Automatic partition backup/restore
  - Module state management
  - Action button support

## Support

For issues or questions:
- GitHub Issues: https://github.com/cyanmint/NoBricking/issues
- Check logs in `/data/adb/nobricking_backups/`
