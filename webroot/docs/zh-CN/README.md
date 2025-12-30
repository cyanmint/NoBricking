# NoBricking

> 一个先进的 Magisk/KernelSU 防砖模块，具有自动分区备份和恢复功能

## 概述

NoBricking 是一个智能防砖模块，可以自动检测启动失败并将您的设备恢复到已知良好状态。当检测到 3 次连续启动失败时，模块会自动恢复备份的分区和模块配置。

## 核心功能

- ✅ **自动分区备份**: boot、init_boot（如果存在）、recovery
- ✅ **启动失败检测**: 使用标志文件跟踪启动尝试
- ✅ **智能恢复**: 在 3 次失败后自动恢复备份
- ✅ **模块状态管理**: 备份和恢复启用的模块
- ✅ **手动备份**: 通过操作按钮或 WebUI 触发
- ✅ **WebUI 管理器**: 用于 KernelSU 用户的综合 Web 界面
- ✅ **多语言支持**: 支持 20+ 种语言

## 安装

1. 从 [Releases](https://github.com/cyanmint/NoBricking/releases) 下载最新的 ZIP 文件
2. 在 Magisk/KernelSU 管理器中打开
3. 选择 ZIP 文件并安装
4. 重启设备
5. 安装期间会自动创建初始备份

## 使用方法

### 手动备份

**方法 1: 操作按钮**
- 在 Magisk/KSU 管理器中打开模块
- 点击"操作"按钮
- 等待备份完成

**方法 2: WebUI（仅限 KSU）**
- 在 KSU 管理器中打开模块
- 点击打开 WebUI
- 导航到"备份"页面
- 点击"创建备份"

### WebUI 功能（仅限 KernelSU）

- 📊 **仪表板**: 实时状态概览
- 💾 **备份管理**: 查看、创建、删除和设置活动备份
- 🚩 **标志管理**: 监控和清除启动标志
- ⚙️ **恢复设置**: 自定义恢复哪些分区和模块
- 📚 **文档**: 集成的多语言文档
- 🌍 **语言**: 支持 20+ 种语言

## 兼容性

- ✅ Magisk（所有版本）
- ✅ KernelSU（原版、Next、Sukisu Ultra 等）
- ✅ APatch
- ✅ Android 10+
- ✅ A/B 和非 A/B 分区

## 许可证

版权所有 (c) 2024 cyanmint

本程序是自由软件；您可以根据 GNU 通用公共许可证第 3 版或更高版本的条款重新分发和/或修改它。

## 链接

- [GitHub 仓库](https://github.com/cyanmint/NoBricking)
- [问题跟踪器](https://github.com/cyanmint/NoBricking/issues)
