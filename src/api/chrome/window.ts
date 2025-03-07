import { IS_FIREFOX_ANDROID } from "@util/constant/environment"
import { handleError } from "./common"

export function listAllWindows(): Promise<chrome.windows.Window[]> {
    if (IS_FIREFOX_ANDROID) {
        // windows API not supported on Firefox for Android
        return Promise.resolve([])
    }
    return new Promise(resolve => chrome.windows.getAll(windows => {
        handleError("listAllWindows")
        resolve(windows || [])
    }))
}

export function isNoneWindowId(windowId: number) {
    if (IS_FIREFOX_ANDROID) {
        return false
    }
    return !windowId || windowId === chrome.windows.WINDOW_ID_NONE
}

export function getFocusedNormalWindow(): Promise<chrome.windows.Window> {
    if (IS_FIREFOX_ANDROID) {
        return Promise.resolve(null)
    }
    return new Promise(resolve => chrome.windows.getLastFocused(
        // Only find normal window
        { windowTypes: ['normal'] },
        window => {
            handleError('getFocusedNormalWindow')
            if (!window?.focused || isNoneWindowId(window?.id)) {
                resolve(undefined)
            } else {
                resolve(window)
            }
        }
    ))
}

export function getWindow(id: number): Promise<chrome.windows.Window> {
    if (IS_FIREFOX_ANDROID) {
        return Promise.resolve(null)
    }
    return new Promise(resolve => chrome.windows.get(id, win => resolve(win)))
}

type _Handler = (windowId: number) => void

export function onNormalWindowFocusChanged(handler: _Handler) {
    if (IS_FIREFOX_ANDROID) {
        return
    }
    chrome.windows.onFocusChanged.addListener(windowId => {
        handleError('onWindowFocusChanged')
        handler(windowId)
    })
}