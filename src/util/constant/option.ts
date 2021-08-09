export function defaultPopup(): Timer.PopupOption {
    // Use template
    return {
        popupMax: 10,
        defaultType: 'focus'
    }
}

export function defaultAdditional(): Timer.AdditionalOption {
    return {
        displayWhitelistMenu: true
    }
}