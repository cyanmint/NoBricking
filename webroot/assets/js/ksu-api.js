// KSU API Wrapper for NoBricking
const KSU = {
    isAvailable: typeof window.ksu !== 'undefined' && typeof window.ksu.exec === 'function',
    
    // Execute shell command
    async exec(command) {
        if (!this.isAvailable) {
            console.error('KSU API not available');
            return { success: false, error: 'KSU API not available' };
        }
        
        try {
            const result = await window.ksu.exec(command);
            return { success: true, output: result };
        } catch (error) {
            console.error('KSU exec error:', error);
            return { success: false, error: error.toString() };
        }
    },
    
    // Get backup directory path
    getBackupDir() {
        return '/data/adb/nobricking_backups';
    },
    
    // Get module directory path
    getModuleDir() {
        return '/data/adb/modules/nobricking';
    },
    
    // Get status information
    async getStatus() {
        const backupDir = this.getBackupDir();
        const script = `
            BACKUP_DIR="${backupDir}"
            
            # Count flags
            FLAGS=\$(ls -1 "\$BACKUP_DIR/flags"/*.flag 2>/dev/null | wc -l)
            
            # Get last backup time
            LAST_BACKUP="Never"
            if [ -f "\$BACKUP_DIR/backup.log" ]; then
                LAST_BACKUP=\$(tail -n 1 "\$BACKUP_DIR/backup.log" 2>/dev/null | cut -d: -f1 | sed 's/.*\\([0-9]\\{4\\}-[0-9]\\{2\\}-[0-9]\\{2\\}\\).*/\\1/' || echo "Never")
            fi
            
            # Get backup size
            BACKUP_SIZE=\$(du -sh "\$BACKUP_DIR/partitions" 2>/dev/null | awk '{print \$1}' || echo "0")
            
            # Count backups
            BACKUP_COUNT=\$(ls -1 "\$BACKUP_DIR/partitions"/*.img 2>/dev/null | wc -l)
            
            # Get restore settings
            RESTORE_SETTINGS="default"
            if [ -f "\$BACKUP_DIR/restore_settings.conf" ]; then
                RESTORE_SETTINGS=\$(cat "\$BACKUP_DIR/restore_settings.conf")
            fi
            
            # Output JSON
            echo "{"
            echo "\\"flags\\":\$FLAGS,"
            echo "\\"lastBackup\\":\\"\$LAST_BACKUP\\","
            echo "\\"backupSize\\":\\"\$BACKUP_SIZE\\","
            echo "\\"backupCount\\":\$BACKUP_COUNT,"
            echo "\\"restoreSettings\\":\\"\$RESTORE_SETTINGS\\""
            echo "}"
        `;
        
        const result = await this.exec(script);
        if (result.success) {
            try {
                return JSON.parse(result.output);
            } catch (e) {
                console.error('Failed to parse status JSON:', e);
                return null;
            }
        }
        return null;
    },
    
    // Get list of backups
    async getBackups() {
        const backupDir = this.getBackupDir();
        const script = `
            BACKUP_DIR="${backupDir}"
            ACTIVE_BACKUP=\$(cat "\$BACKUP_DIR/.active_backup" 2>/dev/null || echo "latest")
            
            echo "["
            first=true
            for img in "\$BACKUP_DIR/partitions"/*.img; do
                if [ -f "\$img" ]; then
                    [ "\$first" = "false" ] && echo ","
                    first=false
                    name=\$(basename "\$img")
                    size=\$(du -h "\$img" 2>/dev/null | awk '{print \$1}')
                    date=\$(stat -c %y "\$img" 2>/dev/null | cut -d. -f1)
                    timestamp=\$(stat -c %Y "\$img" 2>/dev/null)
                    active="false"
                    if [ "\$ACTIVE_BACKUP" = "\$name" ] || ([ "\$ACTIVE_BACKUP" = "latest" ] && [ "\$timestamp" = "\$(ls -t "\$BACKUP_DIR/partitions"/*.img 2>/dev/null | head -1 | xargs stat -c %Y 2>/dev/null)" ]); then
                        active="true"
                    fi
                    echo "{\\"name\\":\\"\$name\\",\\"size\\":\\"\$size\\",\\"date\\":\\"\$date\\",\\"timestamp\\":\$timestamp,\\"active\\":\$active}"
                fi
            done
            echo "]"
        `;
        
        const result = await this.exec(script);
        if (result.success) {
            try {
                return JSON.parse(result.output);
            } catch (e) {
                console.error('Failed to parse backups JSON:', e);
                return [];
            }
        }
        return [];
    },
    
    // Get list of flags
    async getFlags() {
        const backupDir = this.getBackupDir();
        const script = `
            BACKUP_DIR="${backupDir}"
            
            echo "["
            first=true
            for flag in "\$BACKUP_DIR/flags"/*.flag; do
                if [ -f "\$flag" ]; then
                    [ "\$first" = "false" ] && echo ","
                    first=false
                    name=\$(basename "\$flag")
                    content=\$(cat "\$flag" 2>/dev/null)
                    date=\$(stat -c %y "\$flag" 2>/dev/null | cut -d. -f1)
                    echo "{\\"name\\":\\"\$name\\",\\"content\\":\\"\$content\\",\\"date\\":\\"\$date\\"}"
                fi
            done
            echo "]"
        `;
        
        const result = await this.exec(script);
        if (result.success) {
            try {
                return JSON.parse(result.output);
            } catch (e) {
                console.error('Failed to parse flags JSON:', e);
                return [];
            }
        }
        return [];
    },
    
    // Create new backup
    async createBackup() {
        const moduleDir = this.getModuleDir();
        const script = `sh "${moduleDir}/action.sh" manual`;
        return await this.exec(script);
    },
    
    // Clear all flags
    async clearFlags() {
        const backupDir = this.getBackupDir();
        const script = `rm -f "${backupDir}/flags"/*.flag`;
        return await this.exec(script);
    },
    
    // Delete specific flag
    async deleteFlag(flagName) {
        const backupDir = this.getBackupDir();
        const script = `rm -f "${backupDir}/flags/${flagName}"`;
        return await this.exec(script);
    },
    
    // Set active backup
    async setActiveBackup(backupName) {
        const backupDir = this.getBackupDir();
        const script = `echo "${backupName}" > "${backupDir}/.active_backup"`;
        return await this.exec(script);
    },
    
    // Delete backup
    async deleteBackup(backupName) {
        const backupDir = this.getBackupDir();
        const script = `rm -f "${backupDir}/partitions/${backupName}"`;
        return await this.exec(script);
    },
    
    // Save restore settings
    async saveRestoreSettings(settings) {
        const backupDir = this.getBackupDir();
        const settingsJSON = JSON.stringify(settings).replace(/"/g, '\\"');
        const script = `echo '${settingsJSON}' > "${backupDir}/restore_settings.conf"`;
        return await this.exec(script);
    },
    
    // Load restore settings
    async loadRestoreSettings() {
        const backupDir = this.getBackupDir();
        const script = `cat "${backupDir}/restore_settings.conf" 2>/dev/null || echo '{}'`;
        const result = await this.exec(script);
        if (result.success) {
            try {
                return JSON.parse(result.output);
            } catch (e) {
                return {};
            }
        }
        return {};
    },
    
    // Trigger restore
    async triggerRestore() {
        const backupDir = this.getBackupDir();
        const script = `
            BACKUP_DIR="${backupDir}"
            mkdir -p "\$BACKUP_DIR/flags"
            touch "\$BACKUP_DIR/flags/manual_restore_1.flag"
            touch "\$BACKUP_DIR/flags/manual_restore_2.flag"
            touch "\$BACKUP_DIR/flags/manual_restore_3.flag"
            (sleep 3 && reboot) &
        `;
        return await this.exec(script);
    },
    
    // Get module version
    async getModuleVersion() {
        const moduleDir = this.getModuleDir();
        const script = `grep "^version=" "${moduleDir}/module.prop" | cut -d= -f2`;
        const result = await this.exec(script);
        return result.success ? result.output.trim() : '1.0.4';
    }
};
