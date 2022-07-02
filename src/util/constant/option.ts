/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export function defaultPopup(): timer.option.PopupOption {
    // Use template
    return {
        popupMax: 10,
        defaultType: 'focus',
        defaultDuration: "today",
        /**
         * Change the default value to 'true' since v0.5.4
         */
        displaySiteName: true
    }
}

export function defaultAppearance(): timer.option.AppearanceOption {
    return {
        displayWhitelistMenu: true,
        // Change false to true @since 0.8.4
        displayBadgeText: true,
        locale: "default",
        printInConsole: true,
        darkMode: "off",
        // 6 PM - 6 AM
        // 18*60*60 
        darkModeTimeStart: 64800,
        // 6*60*60
        darkModeTimeEnd: 21600,
    }
}

export function defaultStatistics(): timer.option.StatisticsOption {
    return {
        countWhenIdle: false,
        collectSiteName: true,
        countLocalFiles: false
    }
}