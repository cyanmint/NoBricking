// NoBricking Internationalization (i18n) System

const i18n = {
    // Current language
    currentLang: 'en',
    
    // Available languages
    languages: {
        en: 'English',
        'zh-CN': '简体中文',
        'zh-TW': '繁體中文',
        ja: '日本語',
        ko: '한국어',
        es: 'Español',
        fr: 'Français',
        de: 'Deutsch',
        ru: 'Русский',
        pt: 'Português',
        it: 'Italiano',
        ar: 'العربية',
        hi: 'हिन्दी',
        tr: 'Türkçe',
        vi: 'Tiếng Việt',
        th: 'ไทย',
        id: 'Bahasa Indonesia',
        ms: 'Bahasa Melayu',
        pl: 'Polski',
        nl: 'Nederlands'
    },
    
    // Translation strings
    translations: {
        en: {
            // App title
            appTitle: 'NoBricking Manager',
            
            // Navigation
            menu: 'Menu',
            dashboard: 'Dashboard',
            backups: 'Backups',
            bootFlags: 'Boot Flags',
            restoreSettings: 'Restore Settings',
            documentation: 'Documentation',
            about: 'About',
            language: 'Language',
            
            // Dashboard
            refresh: 'Refresh',
            bootFlagsCount: 'Boot Flags',
            totalBackups: 'Total Backups',
            lastBackup: 'Last Backup',
            totalSize: 'Total Size',
            never: 'Never',
            quickActions: 'Quick Actions',
            createBackup: 'Create Backup',
            clearFlags: 'Clear Flags',
            activityLog: 'Activity Log',
            
            // Backups page
            backupManagement: 'Backup Management',
            backupList: 'Backup List',
            noBackups: 'No backups found',
            active: 'Active',
            setActive: 'Set Active',
            deleteBackup: 'Delete',
            backupDate: 'Date',
            backupSize: 'Size',
            confirmDeleteBackup: 'Are you sure you want to delete this backup?',
            confirmCreateBackup: 'Create a new backup? This may take a few minutes.',
            
            // Flags page
            flagManagement: 'Boot Flag Management',
            flagList: 'Flag List',
            noFlags: 'No boot flags found',
            clearAllFlags: 'Clear All Flags',
            deleteFlag: 'Delete',
            flagTimestamp: 'Timestamp',
            confirmClearFlags: 'Clear all boot flags?',
            confirmDeleteFlag: 'Delete this flag?',
            
            // Restore Settings
            restoreConfiguration: 'Restore Configuration',
            partitionsToRestore: 'Partitions to Restore',
            bootPartition: 'Boot Partition',
            initBootPartition: 'Init Boot Partition',
            recoveryPartition: 'Recovery Partition',
            moduleSettings: 'Module Settings',
            restoreModuleStates: 'Restore Module States',
            disableAllModules: 'Disable All Modules First',
            preserveNoBricking: 'Preserve NoBricking Module',
            postRestoreActions: 'Post-Restore Actions',
            autoReboot: 'Auto Reboot After Restore',
            clearFlagsAfterRestore: 'Clear Flags After Restore',
            saveSettings: 'Save Settings',
            settingsSaved: 'Settings saved successfully',
            
            // About page
            aboutTitle: 'About NoBricking',
            version: 'Version',
            author: 'Author',
            description: 'Description',
            aboutDescription: 'NoBricking is an advanced anti-bricking module for Magisk/KernelSU that automatically detects boot failures and restores your device to a known-good state.',
            features: 'Features',
            feature1: 'Automatic partition backup (boot, init_boot, recovery)',
            feature2: 'Boot failure detection with 3-failure threshold',
            feature3: 'Automatic restore of partitions and module states',
            feature4: 'Manual backup creation via action button or WebUI',
            feature5: 'Comprehensive WebUI for backup management',
            feature6: 'Multi-language support',
            compatibility: 'Compatibility',
            compatibilityText: 'Magisk, KernelSU, KSU Next, Sukisu Ultra, APatch, and other modern root solutions',
            license: 'License',
            repository: 'Repository',
            
            // Messages
            initialized: 'Initializing NoBricking Manager...',
            initComplete: 'Initialization complete',
            ksuNotDetected: 'KSU API not detected. Please open this page from KSU Manager.',
            ksuDetected: 'KSU API detected and ready',
            statusUpdated: 'Status updated successfully',
            fetchStatusFailed: 'Failed to fetch status',
            refreshingData: 'Refreshing all data...',
            creatingBackup: 'Creating backup... Please wait.',
            backupCreated: 'Backup created successfully!',
            backupFailed: 'Failed to create backup',
            backupDeleted: 'Backup deleted successfully',
            backupSetActive: 'Backup set as active',
            clearingFlags: 'Clearing all boot flags...',
            flagsCleared: 'All boot flags cleared successfully',
            flagsClearFailed: 'Failed to clear flags',
            flagDeleted: 'Flag deleted successfully',
            loadingBackups: 'Loading backups...',
            backupsLoaded: 'Backups loaded successfully',
            loadingFlags: 'Loading boot flags...',
            flagsLoaded: 'Flags loaded successfully',
            
            // Warnings
            warning3Flags: 'Warning: 3+ boot flags detected! System may be unstable.',
            warning2Flags: 'Caution: 2 boot flags detected. One more failed boot will trigger restore.',
            ksuApiWarning: 'Warning: KSU API not available. Some features may not work.',
            
            // Buttons
            btnClose: 'Close',
            btnCancel: 'Cancel',
            btnConfirm: 'Confirm',
            btnSave: 'Save',
            btnDelete: 'Delete',
            btnRefresh: 'Refresh',
            
            // Status
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            warning: 'Warning',
            info: 'Info'
        },
        
        'zh-CN': {
            // App title
            appTitle: 'NoBricking 管理器',
            
            // Navigation
            menu: '菜单',
            dashboard: '仪表板',
            backups: '备份',
            bootFlags: '启动标志',
            restoreSettings: '恢复设置',
            documentation: '文档',
            about: '关于',
            language: '语言',
            
            // Dashboard
            refresh: '刷新',
            bootFlagsCount: '启动标志',
            totalBackups: '总备份数',
            lastBackup: '最后备份',
            totalSize: '总大小',
            never: '从未',
            quickActions: '快速操作',
            createBackup: '创建备份',
            clearFlags: '清除标志',
            activityLog: '活动日志',
            
            // Backups page
            backupManagement: '备份管理',
            backupList: '备份列表',
            noBackups: '未找到备份',
            active: '活动',
            setActive: '设为活动',
            deleteBackup: '删除',
            backupDate: '日期',
            backupSize: '大小',
            confirmDeleteBackup: '确定要删除此备份吗？',
            confirmCreateBackup: '创建新备份？这可能需要几分钟。',
            
            // Flags page
            flagManagement: '启动标志管理',
            flagList: '标志列表',
            noFlags: '未找到启动标志',
            clearAllFlags: '清除所有标志',
            deleteFlag: '删除',
            flagTimestamp: '时间戳',
            confirmClearFlags: '清除所有启动标志？',
            confirmDeleteFlag: '删除此标志？',
            
            // Restore Settings
            restoreConfiguration: '恢复配置',
            partitionsToRestore: '要恢复的分区',
            bootPartition: '启动分区',
            initBootPartition: '初始启动分区',
            recoveryPartition: '恢复分区',
            moduleSettings: '模块设置',
            restoreModuleStates: '恢复模块状态',
            disableAllModules: '首先禁用所有模块',
            preserveNoBricking: '保留 NoBricking 模块',
            postRestoreActions: '恢复后操作',
            autoReboot: '恢复后自动重启',
            clearFlagsAfterRestore: '恢复后清除标志',
            saveSettings: '保存设置',
            settingsSaved: '设置已成功保存',
            
            // About page
            aboutTitle: '关于 NoBricking',
            version: '版本',
            author: '作者',
            description: '描述',
            aboutDescription: 'NoBricking 是一个用于 Magisk/KernelSU 的高级防砖模块，可自动检测启动失败并将设备恢复到已知良好状态。',
            features: '功能',
            feature1: '自动分区备份（boot、init_boot、recovery）',
            feature2: '启动失败检测（3次失败阈值）',
            feature3: '自动恢复分区和模块状态',
            feature4: '通过操作按钮或 WebUI 手动创建备份',
            feature5: '用于备份管理的综合 WebUI',
            feature6: '多语言支持',
            compatibility: '兼容性',
            compatibilityText: 'Magisk、KernelSU、KSU Next、Sukisu Ultra、APatch 和其他现代 root 解决方案',
            license: '许可证',
            repository: '代码仓库',
            
            // Messages
            initialized: '正在初始化 NoBricking 管理器...',
            initComplete: '初始化完成',
            ksuNotDetected: '未检测到 KSU API。请从 KSU 管理器打开此页面。',
            ksuDetected: 'KSU API 已检测并准备就绪',
            statusUpdated: '状态更新成功',
            fetchStatusFailed: '获取状态失败',
            refreshingData: '正在刷新所有数据...',
            creatingBackup: '正在创建备份...请稍候。',
            backupCreated: '备份创建成功！',
            backupFailed: '创建备份失败',
            backupDeleted: '备份删除成功',
            backupSetActive: '备份已设为活动',
            clearingFlags: '正在清除所有启动标志...',
            flagsCleared: '所有启动标志已成功清除',
            flagsClearFailed: '清除标志失败',
            flagDeleted: '标志删除成功',
            loadingBackups: '正在加载备份...',
            backupsLoaded: '备份加载成功',
            loadingFlags: '正在加载启动标志...',
            flagsLoaded: '标志加载成功',
            
            // Warnings
            warning3Flags: '警告：检测到 3+ 启动标志！系统可能不稳定。',
            warning2Flags: '注意：检测到 2 个启动标志。再次启动失败将触发恢复。',
            ksuApiWarning: '警告：KSU API 不可用。某些功能可能无法正常工作。',
            
            // Buttons
            btnClose: '关闭',
            btnCancel: '取消',
            btnConfirm: '确认',
            btnSave: '保存',
            btnDelete: '删除',
            btnRefresh: '刷新',
            
            // Status
            loading: '加载中...',
            error: '错误',
            success: '成功',
            warning: '警告',
            info: '信息'
        }
    },
    
    // Initialize i18n
    init() {
        // Detect browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const savedLang = localStorage.getItem('nobricking_lang');
        
        // Set initial language
        if (savedLang && this.translations[savedLang]) {
            this.currentLang = savedLang;
        } else if (this.translations[browserLang]) {
            this.currentLang = browserLang;
        } else if (browserLang.startsWith('zh')) {
            this.currentLang = 'zh-CN';
        } else {
            this.currentLang = 'en';
        }
        
        // Apply language
        this.applyLanguage();
        
        // Populate language selector if exists
        this.populateLanguageSelector();
    },
    
    // Get translation
    t(key) {
        const lang = this.translations[this.currentLang];
        return lang && lang[key] ? lang[key] : key;
    },
    
    // Set language
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('nobricking_lang', lang);
            this.applyLanguage();
        }
    },
    
    // Apply language to all elements with data-i18n attribute
    applyLanguage() {
        // Update document language
        document.documentElement.lang = this.currentLang;
        
        // Update all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // Update page title
        document.title = this.t('appTitle');
        
        // Trigger custom event for dynamic content
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { lang: this.currentLang } 
        }));
    },
    
    // Populate language selector
    populateLanguageSelector() {
        const selector = document.getElementById('languageSelector');
        if (selector) {
            selector.innerHTML = '';
            
            Object.entries(this.languages).forEach(([code, name]) => {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = name;
                option.selected = code === this.currentLang;
                selector.appendChild(option);
            });
            
            selector.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
    i18n.init();
}
