# NoBricking WebUI

This directory contains the Web UI for NoBricking module, available for KernelSU users.

## Features

The WebUI provides an intuitive interface to manage your backup system:

### 📊 System Status Dashboard
- Real-time boot flag count
- Last backup timestamp
- Total backup size
- Module status indicator

### 🔧 Quick Actions
- **Create Backup Now**: Instantly create a new backup of all partitions
- **Clear Boot Flags**: Reset boot attempt counter
- **Restore from Backup**: Restore backed up partitions (with confirmation)
- **Refresh Status**: Update all displayed information

### 💾 Backup Details
- List of all backed up partitions
- Individual file sizes
- Backup timestamps

### 📝 Activity Log
- Real-time logging of all operations
- Color-coded status messages (success/error)
- Scrollable log history

## How to Access

1. Install the NoBricking module in KernelSU Manager
2. Open KernelSU Manager app
3. Navigate to **Modules** section
4. Find **NoBricking** in the module list
5. Tap on the module to open its WebUI

## Design

The UI features:
- Modern gradient design (purple to indigo)
- Responsive layout for mobile and desktop
- Card-based interface sections
- Smooth animations and transitions
- Dark theme log console
- Color-coded alerts and status indicators

## Technical Details

### KSU Integration
The WebUI uses KernelSU's built-in WebUI framework:
- No separate HTTP server required
- Executes shell commands via `window.ksu.exec()` API
- Secure execution environment
- Access controlled by KSU Manager

### API Endpoints
All operations are executed through shell scripts:
- `/api/status` - Fetch system status and backup information
- `/api/backup` - Trigger backup creation
- `/api/clear-flags` - Remove all boot flags
- `/api/restore` - Initiate restore process

### Files
- `index.html` - Complete single-file WebUI
- `.shell` - KSU shell configuration
- `README.md` - This documentation

## Browser Compatibility

The WebUI is tested and works with:
- KSU Manager's built-in WebView
- Chrome/Chromium-based browsers
- Mobile browsers (Android)

## Security

- All operations require KSU root access
- Confirmation dialogs for destructive actions (restore)
- No external network access required
- All data stays on device
