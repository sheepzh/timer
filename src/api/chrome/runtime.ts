import { handleError } from "./common"

export function getRuntimeId(): string {
    return chrome.runtime.id
}

export function sendMsg2Runtime<T = any, R = any>(code: timer.mq.ReqCode, data?: T): Promise<R> {
    // Fix proxy data failed to serialized in Firefox
    if (data !== undefined) {
        data = JSON.parse(JSON.stringify(data))
    }
    const request: timer.mq.Request<T> = { code, data }
    return new Promise((resolve, reject) => chrome.runtime.sendMessage(request,
        (response: timer.mq.Response<R>) => {
            handleError('sendMsg2Runtime')
            const resCode = response?.code
            resCode === 'success'
                ? resolve(response.data)
                : reject(new Error(response?.msg))
        })
    )
}

export function onRuntimeMessage<T = any, R = any>(handler: ChromeMessageHandler<T, R>): void {
    // Be careful!!!
    // Can't use await/async in callback parameter
    chrome.runtime.onMessage.addListener((message: timer.mq.Request<T>, sender: chrome.runtime.MessageSender, sendResponse: timer.mq.Callback<R>) => {
        handler(message, sender).then((response: timer.mq.Response<R>) => sendResponse(response))
        // 'return true' will force chrome to wait for the response processed in the above promise.
        // @see https://github.com/mozilla/webextension-polyfill/issues/130
        return true
    })
}

export function onInstalled(handler: (reason: ChromeOnInstalledReason) => void): void {
    chrome.runtime.onInstalled.addListener(detail => handler(detail.reason))
}

export function getVersion(): string {
    return chrome.runtime.getManifest().version
}

export function setUninstallURL(url: string): Promise<void> {
    return new Promise(resolve => chrome.runtime.setUninstallURL(url, resolve))
}

/**
 * Get the url of this extension
 *
 * @param path The path relative to the root directory of this extension
 */
export function getUrl(path: string): string {
    return chrome.runtime.getURL(path)
}

export async function isAllowedFileSchemeAccess(): Promise<boolean> {
    const res = await chrome.extension?.isAllowedFileSchemeAccess?.()
    return !!res
}