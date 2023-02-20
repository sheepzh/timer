import { handleError } from "./common"


export function listAllWindows(): Promise<chrome.windows.Window[]> {
    return new Promise(resolve => chrome.windows.getAll(windows => {
        handleError("listAllWindows")
        resolve(windows || [])
    }))
}

export function isNoneWindowId(windowId: number) {
    return !windowId || windowId === chrome.windows.WINDOW_ID_NONE
}

export function getFocusedNormalWindow(): Promise<chrome.windows.Window> {
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
    return new Promise(resolve =>
        chrome.windows.get(id)
            .then(win => resolve(win))
            .catch(_ => resolve(undefined))
    )
}

type _Handler = (windowId: number) => void

export function onNormalWindowFocusChanged(handler: _Handler) {
    chrome.windows.onFocusChanged.addListener(windowId => {
        handleError('onWindowFocusChanged')
        handler(windowId)
    }, { windowTypes: ['normal'] })
}