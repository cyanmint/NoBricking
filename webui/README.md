# NoBricking WebUI

Modern web-based management interface for the NoBricking anti-bricking module.

## Features

### 📊 Dashboard
- Real-time system status monitoring
- Boot flag count and backup statistics
- Quick action buttons for common tasks
- Activity log showing recent operations

### 💾 Backup Management
- View all backups with details (size, date, status)
- Set active backup for automatic restoration
- Create new backups manually
- Delete old backups
- Active backup indicator

### 🚩 Boot Flag Management
- View all boot flags with timestamps
- Clear all flags at once
- Delete individual flags
- Warning system for high flag counts

### ⚙️ Restore Settings
- Customize which partitions get restored
  - Boot partition
  - Init boot partition
  - Recovery partition
- Module restoration options
- Safety options (auto-reboot, flag cleanup)

### 📚 Documentation
- Integrated documentation using Docsify
- All module docs accessible from WebUI
- Searchable content
- Clean, organized presentation

## Design

The WebUI is designed to look like a native mobile manager app rather than a traditional website:

- Modern, clean interface with card-based layout
- Responsive design (works on mobile and desktop)
- App-like navigation with slide-out menu
- Material Design inspired components
- Smooth animations and transitions
- Touch-optimized for mobile devices

## Technical Details

### Technologies Used
- Pure HTML5, CSS3, JavaScript (no frameworks)
- KSU WebUI API for shell command execution
- Docsify for documentation rendering
- Mobile-first responsive design

### File Structure
```
webui/
├── index.html              # Main application entry point
├── assets/
│   ├── css/
│   │   └── app.css        # Application styles
│   └── js/
│       ├── app.js         # Main application logic
│       └── ksu-api.js     # KSU API wrapper
└── docs/                   # Documentation files
    ├── index.html
    ├── _sidebar.md
    ├── README.md
    ├── CHANGELOG.md
    ├── BUILD.md
    ├── SECURITY.md
    ├── WORKFLOW.md
    └── IMPLEMENTATION.md
```

### KSU Integration

The WebUI uses KernelSU's built-in WebUI framework:
- Executes shell commands via `window.ksu.exec()` API
- All operations stay on-device (no external network access)
- Secure execution environment
- Fully integrated with KSU Manager

## Usage

### For Users
1. Install NoBricking module in KSU Manager
2. Open KSU Manager app
3. Navigate to Modules section
4. Tap on NoBricking module
5. The WebUI will open automatically

### For Developers
The WebUI is built with maintainability in mind:
- Modular JavaScript code
- Well-commented functions
- Consistent naming conventions
- Easy to extend with new features

## Browser Compatibility

Tested and working with:
- KSU Manager's built-in WebView
- Chrome/Chromium-based browsers
- Mobile browsers (Android)

## Security

- All operations require KSU root access
- Confirmation dialogs for destructive actions
- No external network access required
- All data stays on device
- Uses KSU's secure execution environment

## License

Part of the NoBricking module by cyanmint.
