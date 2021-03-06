import InstalledHandler from './chrome/installed-handler'
import database, { openLog } from './database'
import { FOCUS, HOST_END, HOST_START, SAVE_FOCUS, UNFOCUS } from './util/constant'

openLog()

let lastFocusTabId: number = undefined
const hostStart = {}
const hostCount = {}

chrome.runtime.onInstalled.addListener(new InstalledHandler().handle)

chrome.runtime.onMessage.addListener((data, _, sendResponse) => {
    const { code, host, focusStart } = data
    if (!host) {
        // do nothing
    } else if (code === HOST_START) {
        const count = hostCount[host] || 0
        if (!count) {
            hostStart[host] = new Date().getTime()
        }
        hostCount[host] = count + 1
    } else if (code === HOST_END) {
        const count = hostCount[host]
        if (!count) {
            hostCount[host] = 0
            hostStart[host] = undefined
        } else {
            const now = new Date().getTime()
            database.addTotal(host, hostStart[host] || now)
            hostStart[host] = now
            hostCount[host] = count - 1
        }

    } else if (code === SAVE_FOCUS) {
        database.addFocus(host, focusStart)
        const now = new Date().getTime()
        database.addTotal(host, hostStart[host] || now)
        hostStart[host] = now
    }
    sendResponse("ok")
})

chrome.tabs.onActivated.addListener((tabInfo: chrome.tabs.TabActiveInfo) => {
    const tabId: number = tabInfo.tabId
    chrome.tabs.get(tabId, tab => {
        const url = tab.url
        // Judge has content_script
        const ofBrowser = /^(chrome(-error)?):\/\/*$/g.test(url)
            || /^about:.*$/.test(url)
        !!lastFocusTabId && chrome.tabs.sendMessage(lastFocusTabId, { code: UNFOCUS })
        !ofBrowser && chrome.tabs.sendMessage(tabId, { code: FOCUS })
        lastFocusTabId = ofBrowser ? undefined : tabId
    })
})

chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        // All windows lost focus
        !!lastFocusTabId && chrome.tabs.sendMessage(lastFocusTabId, { code: UNFOCUS })
        lastFocusTabId = undefined
    }
})
