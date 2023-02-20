import { IS_MV3 } from "@util/constant/environment"
import { handleError } from "./common"

const action = IS_MV3 ? chrome.action : chrome.browserAction

export function setBadgeText(text: string, tabId: number): Promise<void> {
    return new Promise(resolve => action?.setBadgeText({ tabId, text }, () => {
        handleError('setBadgeText')
        resolve()
    }))
}