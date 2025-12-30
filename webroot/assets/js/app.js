// NoBricking Web UI Application
let currentPage = 'dashboard';
let autoRefreshInterval = null;

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for i18n to initialize
    if (typeof i18n !== 'undefined') {
        i18n.init();
    }
    
    addLog(i18n.t('initialized'), 'success');
    
    if (!KSU.isAvailable) {
        addLog(i18n.t('ksuApiWarning'), 'error');
        showAlert(i18n.t('ksuNotDetected'), 'warning');
    } else {
        addLog(i18n.t('ksuDetected'), 'success');
    }
    
    // Load module version
    const version = await KSU.getModuleVersion();
    document.getElementById('moduleVersion').textContent = version;
    
    // Load initial data
    await refreshAll();
    
    // Load restore settings
    await loadRestoreSettings();
    
    // Start auto-refresh
    startAutoRefresh();
    
    addLog(i18n.t('initComplete'), 'success');
    
    // Listen for language changes
    window.addEventListener('languageChanged', () => {
        // Refresh current page content
        if (currentPage === 'backups') {
            loadBackups();
        } else if (currentPage === 'flags') {
            loadFlags();
        }
    });
});

// Navigation
function navigateTo(page) {
    // Update active page
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`${page}-page`).classList.add('active');
    
    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    document.querySelector(`.menu-item[data-page="${page}"]`).classList.add('active');
    
    currentPage = page;
    toggleMenu(); // Close menu after navigation
    
    // Load page-specific data
    if (page === 'backups') {
        loadBackups();
    } else if (page === 'flags') {
        loadFlags();
    } else if (page === 'docs') {
        loadDocs();
    }
}

// Toggle side menu
function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Refresh all data
async function refreshAll() {
    addLog('Refreshing all data...');
    
    const status = await KSU.getStatus();
    if (status) {
        document.getElementById('flagCount').textContent = status.flags || '0';
        document.getElementById('lastBackup').textContent = status.lastBackup || 'Never';
        document.getElementById('backupSize').textContent = status.backupSize || '0';
        document.getElementById('backupCount').textContent = status.backupCount || '0';
        
        if (status.flags >= 3) {
            showAlert('Warning: 3+ boot flags detected! System may be unstable.', 'danger');
        } else if (status.flags >= 2) {
            showAlert('Caution: 2 boot flags detected. One more failed boot will trigger restore.', 'warning');
        }
        
        addLog('Status updated successfully', 'success');
    } else {
        addLog('Failed to fetch status', 'error');
    }
    
    if (currentPage === 'backups') {
        await loadBackups();
    } else if (currentPage === 'flags') {
        await loadFlags();
    }
}

// Create backup
async function createBackup() {
    if (!confirm('Create a new backup? This may take a few minutes.')) return;
    
    addLog('Starting backup creation...', );
    showAlert('Creating backup... Please wait.');
    
    const result = await KSU.createBackup();
    
    if (result.success) {
        addLog('Backup created successfully', 'success');
        showAlert('Backup created successfully!', 'success');
        await refreshAll();
    } else {
        addLog('Backup creation failed: ' + (result.error || 'Unknown error'), 'error');
        showAlert('Failed to create backup. Check logs.', 'danger');
    }
}

// Clear flags
async function clearFlags() {
    if (!confirm('Clear all boot flags? This will reset the boot attempt counter.')) return;
    
    addLog('Clearing boot flags...');
    
    const result = await KSU.clearFlags();
    
    if (result.success) {
        addLog('Flags cleared successfully', 'success');
        showAlert('Boot flags cleared!', 'success');
        await refreshAll();
    } else {
        addLog('Failed to clear flags', 'error');
        showAlert('Failed to clear flags.', 'danger');
    }
}

// Confirm restore
function confirmRestore() {
    if (confirm('⚠️ WARNING: This will restore backups and reboot your device. Continue?')) {
        triggerRestore();
    }
}

// Trigger restore
async function triggerRestore() {
    addLog('Initiating restore process...');
    showAlert('Restore initiated. Device will reboot shortly...', 'warning');
    
    const result = await KSU.triggerRestore();
    
    if (result.success) {
        addLog('Restore triggered successfully. Rebooting...', 'success');
    } else {
        addLog('Failed to trigger restore: ' + (result.error || 'Unknown error'), 'error');
        showAlert('Failed to trigger restore.', 'danger');
    }
}

// Load backups
async function loadBackups() {
    const list = document.getElementById('backupList');
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">⏳</div><div class="empty-text">Loading backups...</div></div>';
    
    const backups = await KSU.getBackups();
    
    if (backups.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="empty-icon">📦</div><div class="empty-text">No backups found</div></div>';
        return;
    }
    
    // Update dropdown
    const select = document.getElementById('activeBackupSelect');
    select.innerHTML = '<option value="latest">Latest Backup (Default)</option>';
    backups.forEach(backup => {
        const option = document.createElement('option');
        option.value = backup.name;
        option.textContent = `${backup.name} (${backup.size})`;
        if (backup.active) option.selected = true;
        select.appendChild(option);
    });
    
    // Render backup list
    list.innerHTML = '';
    backups.sort((a, b) => b.timestamp - a.timestamp).forEach(backup => {
        const item = document.createElement('div');
        item.className = 'backup-item' + (backup.active ? ' active' : '');
        item.innerHTML = `
            <div class="backup-header">
                <div class="backup-name">${backup.name}</div>
                ${backup.active ? '<div class="backup-badge">Active</div>' : ''}
            </div>
            <div class="backup-details">
                Size: ${backup.size} | Created: ${backup.date}
            </div>
            <div class="backup-actions">
                <button class="backup-btn backup-btn-primary" onclick="setActiveBackupItem('${backup.name}')">
                    Set as Active
                </button>
                <button class="backup-btn backup-btn-danger" onclick="deleteBackupItem('${backup.name}')">
                    Delete
                </button>
            </div>
        `;
        list.appendChild(item);
    });
    
    addLog(`Loaded ${backups.length} backup(s)`, 'success');
}

// Set active backup
async function setActiveBackup() {
    const select = document.getElementById('activeBackupSelect');
    const backupName = select.value;
    
    const result = await KSU.setActiveBackup(backupName);
    
    if (result.success) {
        addLog(`Active backup set to: ${backupName}`, 'success');
        showAlert('Active backup updated!', 'success');
        await loadBackups();
    } else {
        addLog('Failed to set active backup', 'error');
        showAlert('Failed to update active backup.', 'danger');
    }
}

// Set active backup from item
async function setActiveBackupItem(backupName) {
    const result = await KSU.setActiveBackup(backupName);
    
    if (result.success) {
        addLog(`Active backup set to: ${backupName}`, 'success');
        showAlert('Active backup updated!', 'success');
        await loadBackups();
    } else {
        addLog('Failed to set active backup', 'error');
        showAlert('Failed to update active backup.', 'danger');
    }
}

// Delete backup
async function deleteBackupItem(backupName) {
    if (!confirm(`Delete backup "${backupName}"? This cannot be undone.`)) return;
    
    const result = await KSU.deleteBackup(backupName);
    
    if (result.success) {
        addLog(`Deleted backup: ${backupName}`, 'success');
        showAlert('Backup deleted!', 'success');
        await loadBackups();
        await refreshAll();
    } else {
        addLog('Failed to delete backup', 'error');
        showAlert('Failed to delete backup.', 'danger');
    }
}

// Load flags
async function loadFlags() {
    const list = document.getElementById('flagList');
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">⏳</div><div class="empty-text">Loading flags...</div></div>';
    
    const flags = await KSU.getFlags();
    
    if (flags.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="empty-icon">🏁</div><div class="empty-text">No boot flags found</div></div>';
        return;
    }
    
    list.innerHTML = '';
    flags.forEach(flag => {
        const item = document.createElement('div');
        item.className = 'flag-item';
        item.innerHTML = `
            <div class="flag-info">
                <div class="flag-time">${flag.name}</div>
                <div>${flag.content}</div>
                <small>${flag.date}</small>
            </div>
            <button class="flag-delete" onclick="deleteFlagItem('${flag.name}')">Delete</button>
        `;
        list.appendChild(item);
    });
    
    addLog(`Loaded ${flags.length} flag(s)`, 'success');
}

// Delete flag
async function deleteFlagItem(flagName) {
    const result = await KSU.deleteFlag(flagName);
    
    if (result.success) {
        addLog(`Deleted flag: ${flagName}`, 'success');
        await loadFlags();
        await refreshAll();
    } else {
        addLog('Failed to delete flag', 'error');
    }
}

// Save restore settings
async function saveRestoreSettings() {
    const settings = {
        restore_boot: document.getElementById('restore_boot').checked,
        restore_init_boot: document.getElementById('restore_init_boot').checked,
        restore_recovery: document.getElementById('restore_recovery').checked,
        restore_modules: document.getElementById('restore_modules').checked,
        auto_reboot_after_restore: document.getElementById('auto_reboot_after_restore').checked,
        clear_flags_after_restore: document.getElementById('clear_flags_after_restore').checked
    };
    
    const result = await KSU.saveRestoreSettings(settings);
    
    if (result.success) {
        addLog('Restore settings saved', 'success');
        showAlert('Settings saved successfully!', 'success');
    } else {
        addLog('Failed to save settings', 'error');
        showAlert('Failed to save settings.', 'danger');
    }
}

// Load restore settings
async function loadRestoreSettings() {
    const settings = await KSU.loadRestoreSettings();
    
    if (settings.restore_boot !== undefined) {
        document.getElementById('restore_boot').checked = settings.restore_boot;
    }
    if (settings.restore_init_boot !== undefined) {
        document.getElementById('restore_init_boot').checked = settings.restore_init_boot;
    }
    if (settings.restore_recovery !== undefined) {
        document.getElementById('restore_recovery').checked = settings.restore_recovery;
    }
    if (settings.restore_modules !== undefined) {
        document.getElementById('restore_modules').checked = settings.restore_modules;
    }
    if (settings.auto_reboot_after_restore !== undefined) {
        document.getElementById('auto_reboot_after_restore').checked = settings.auto_reboot_after_restore;
    }
    if (settings.clear_flags_after_restore !== undefined) {
        document.getElementById('clear_flags_after_restore').checked = settings.clear_flags_after_restore;
    }
}

// Load documentation
function loadDocs() {
    const container = document.getElementById('docsify-container');
    container.innerHTML = `
        <div id="docsify-app"></div>
        <script>
            window.$docsify = {
                name: 'NoBricking Documentation',
                repo: 'cyanmint/NoBricking',
                loadSidebar: true,
                subMaxLevel: 2,
                auto2top: true,
                homepage: 'README.md'
            };
        </script>
        <script src="https://cdn.jsdelivr.net/npm/docsify@4/lib/docsify.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/docsify@4/lib/plugins/search.min.js"></script>
    `;
}

// Activity log
function addLog(message, type = '') {
    const log = document.getElementById('activityLog');
    const entry = document.createElement('div');
    entry.className = 'log-entry' + (type ? ' ' + type : '');
    const time = new Date().toLocaleTimeString();
    entry.innerHTML = `
        <span class="log-time">${time}</span>
        <span class="log-message">${message}</span>
    `;
    log.insertBefore(entry, log.firstChild);
    
    // Keep only last 50 entries
    while (log.children.length > 50) {
        log.removeChild(log.lastChild);
    }
}

// Show alert
function showAlert(message, type = 'info') {
    // Simple alert for now - could be enhanced with custom toast notifications
    const emoji = {
        success: '✅',
        danger: '⚠️',
        warning: '⚠️',
        info: 'ℹ️'
    };
    alert(`${emoji[type] || ''} ${message}`);
}

// Auto-refresh
function startAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    autoRefreshInterval = setInterval(() => {
        if (currentPage === 'dashboard') {
            refreshAll();
        }
    }, 30000); // Refresh every 30 seconds
}

// Update docs iframe when language changes
window.addEventListener('languageChanged', (e) => {
    const docsIframe = document.getElementById('docsFrame');
    if (docsIframe && currentPage === 'docs') {
        const lang = e.detail.lang;
        let docsPath = 'docs/';
        
        // Map language codes to docs paths
        if (lang === 'zh-CN' || lang === 'zh-TW' || lang.startsWith('zh')) {
            docsPath = 'docs/#/zh-CN/';
        } else {
            docsPath = 'docs/';
        }
        
        docsIframe.src = docsPath;
    }
});

// Update loadDocs function to respect current language
const originalLoadDocs = loadDocs;
loadDocs = function() {
    const lang = i18n.currentLang;
    const docsFrame = document.getElementById('docsFrame');
    
    if (!docsFrame) {
        // Original function creates iframe, let it run first
        if (typeof originalLoadDocs === 'function') {
            originalLoadDocs();
        }
        return;
    }
    
    let docsPath = 'docs/';
    if (lang === 'zh-CN' || lang === 'zh-TW' || lang.startsWith('zh')) {
        docsPath = 'docs/#/zh-CN/';
    }
    
    docsFrame.src = docsPath;
};
