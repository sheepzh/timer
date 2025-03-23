import { IS_ANDROID } from "@util/constant/environment"
import { handleError } from "./common"

export function listAllWindows(): Promise<chrome.windows.Window[]> {
    if (IS_ANDROID) {
        // windows API not supported on Firefox for Android
        return Promise.resolve([])
    }
    return new Promise(resolve => chrome.windows.getAll(windows => {
        handleError("listAllWindows")
        resolve(windows || [])
    }))
}

export function isNoneWindowId(windowId: number) {
    if (IS_ANDROID) {
        return false
    }
    return !windowId || windowId === chrome.windows.WINDOW_ID_NONE
}

export async function getFocusedNormalWindow(): Promise<chrome.windows.Window | undefined> {
    if (IS_ANDROID) {
        return
    }
    return new Promise(resolve => chrome.windows.getLastFocused(
        // Only find normal window
        { windowTypes: ['normal'] },
        window => {
            const { focused, id } = window
            handleError('getFocusedNormalWindow')
            if (!focused || !id || isNoneWindowId(id)) {
                resolve(undefined)
            } else {
                resolve(window)
            }
        }
    ))
}

export async function getWindow(id: number): Promise<chrome.windows.Window | undefined> {
    if (IS_ANDROID) {
        return
    }
    return new Promise(resolve => chrome.windows.get(id, win => resolve(win)))
}

type _Handler = (windowId: number) => void

export function onNormalWindowFocusChanged(handler: _Handler) {
    if (IS_ANDROID) {
        return
    }
    chrome.windows.onFocusChanged.addListener(windowId => {
        handleError('onWindowFocusChanged')
        handler(windowId)
    })
}