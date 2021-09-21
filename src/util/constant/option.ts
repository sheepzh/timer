export function defaultPopup(): Timer.PopupOption {
    // Use template
    return {
        popupMax: 10,
        defaultType: 'focus'
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
        countWhenIdle: false
    }
}