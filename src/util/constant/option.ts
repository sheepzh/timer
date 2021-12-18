/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export function defaultPopup(): Timer.PopupOption {
    // Use template
    return {
        popupMax: 10,
        defaultType: 'focus',
        displaySiteName: false
    }
}

export function defaultAppearance(): Timer.AppearanceOption {
    return {
        displayWhitelistMenu: true,
        displayBadgeText: false
    }
}

export function defaultStatistics(): Timer.StatisticsOption {
    return {
        countWhenIdle: false,
        collectSiteName: true
    }
}