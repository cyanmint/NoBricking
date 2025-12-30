# 更新日志

## 版本 1.2.1 (2024-12-30)

### 错误修复
- **修复恢复分区 A/B 支持**
  - 恢复分区现在可以在支持的设备上正确处理 A/B 插槽
  - 备份根据活动插槽创建 `recovery_a.img` 或 `recovery_b.img`
  - 恢复时正确识别并写入适当的恢复插槽
  - 与非 A/B 恢复分区保持向后兼容性

### 技术变更
- 更新 `action.sh` 使用 `find_boot_partition()` 进行恢复分区备份
- 更新 `post-fs-data.sh` 在恢复时检测 A/B 恢复分区
- 恢复分区备份文件名现在包含插槽后缀（如适用）

## 版本 1.2.0 (2024-12-30)

### 新功能
- **🌍 国际化 (i18n) 支持**
  - WebUI 支持 20+ 种语言
  - 基于浏览器设置自动检测语言
  - 通过下拉菜单手动选择语言
  - 支持的语言：
    - 英语、简体中文、繁体中文、日语、韩语
    - 西班牙语、法语、德语、俄语、葡萄牙语、意大利语
    - 阿拉伯语、印地语、土耳其语、越南语、泰语
    - 印尼语、马来语、波兰语、荷兰语
  - **📚 多语言文档**
    - 提供多种语言的文档
    - 特定语言的 Docsify 导航
    - 自动文档语言切换
    - 简体中文文档已完全翻译

### 改进
- 使用母语支持增强 WebUI 用户体验
- 语言偏好在会话之间保持
- 提高非英语用户的可访问性
- 更新模块描述以突出多语言支持

### 技术变更
- 添加 `i18n.js` 国际化系统
- 使用 `data-i18n` 属性更新 HTML 以进行翻译
- 创建特定语言的文档结构
- 配置 Docsify 以支持多语言
- CSS 改进语言选择器样式

## 版本 1.1.0

### New Features
- **Advanced WebUI Manager** 🎉
  - Modern app-like interface optimized for mobile and desktop
  - Complete backup management system
    - View all current and historical backups
    - Set active backup for restoration
    - Create new backups manually
    - Delete old backups
  - Boot flag management
    - View all boot flags with timestamps
    - Clear all flags or delete individual flags
    - Real-time flag count monitoring
  - Customizable restore settings
    - Select which partitions to restore (boot, init_boot, recovery)
    - Configure module restoration behavior
    - Set auto-reboot and flag cleanup options
  - Integrated documentation using Docsify
    - All module documentation accessible from WebUI
    - Searchable documentation
    - Clean, organized presentation
  - Real-time dashboard
    - System status overview
    - Quick action buttons
    - Activity log
  - Responsive design that looks like a native manager app

## Version 1.0.4

### Bug Fixes
- **Fixed KSU module visibility**: Module now properly shows in KernelSU Manager
  - Removed `SKIPUNZIP=1` from customize.sh which was causing installation issues
  - Previously, ALL files from ZIP were extracted to module directory, including documentation
  - KSU Manager couldn't properly detect the module with extra files present
  - Module now installs cleanly with only necessary runtime files
- **Updated build instructions**: Documented correct way to create module ZIP for KSU compatibility
  - Only include essential module files (no README.md, BUILD.md, etc. in the ZIP)
  - This ensures clean installation and proper module detection

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
