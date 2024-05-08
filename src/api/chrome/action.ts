import { IS_FIREFOX, IS_MV3 } from "@util/constant/environment"
import { handleError } from "./common"

const action = IS_MV3 ? chrome.action : chrome.browserAction

export function setBadgeText(text: string, tabId: number): Promise<void> {
    return new Promise(resolve => action?.setBadgeText({ tabId, text }, () => {
        handleError('setBadgeText')
        resolve()
    }))
}

export function setBadgeBgColor(color: string | chrome.action.ColorArray): Promise<void> {
    if (!color) {
        if (IS_FIREFOX) {
            // Use null to clear bg color for Firefox
            color = null
        } else {
            color = [0, 0, 0, 0]
        }
    }
    return new Promise(resolve => action?.setBadgeBackgroundColor({ color }, () => {
        handleError('setBadgeColor')
        resolve()
    }))
}