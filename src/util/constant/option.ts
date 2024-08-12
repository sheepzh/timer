/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export function defaultPopup(): timer.option.PopupOption {
    // Use template
    return {
        // Change 10 to 7 since 1.3.4
        popupMax: 7,
        defaultType: 'focus',
        defaultDuration: "today",
        /**
         * Change the default value to 'true' since v0.5.4
         */
        displaySiteName: true,
        defaultMergeDomain: false,
    }
}

export function defaultAppearance(): timer.option.AppearanceOption {
    return {
        displayWhitelistMenu: true,
        // Change false to true @since 0.8.4
        displayBadgeText: true,
        locale: "default",
        printInConsole: true,
        darkMode: "default",
        // 6 PM - 6 AM
        // 18*60*60
        darkModeTimeStart: 64800,
        // 6*60*60
        darkModeTimeEnd: 21600,
    }
}

export function defaultStatistics(): timer.option.StatisticsOption {
    return {
        collectSiteName: true,
        countLocalFiles: true,
        weekStart: 'default',
    }
}

export function defaultDailyLimit(): timer.option.DailyLimitOption {
    return {
        limitLevel: 'nothing',
        limitPassword: '',
        limitVerifyDifficulty: 'easy',
    }
}

export function defaultBackup(): timer.option.BackupOption {
    return {
        backupType: 'none',
        clientName: 'unknown',
        backupAuths: {},
        backupExts: {},
        autoBackUp: false,
        autoBackUpInterval: 30,
    }
}

export function defaultOption(): timer.option.AllOption {
    return {
        ...defaultPopup(),
        ...defaultAppearance(),
        ...defaultStatistics(),
        ...defaultBackup(),
        ...defaultDailyLimit(),
    }
}