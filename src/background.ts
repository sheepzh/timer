import database from './database'
import { FOCUS, HOST_END, HOST_START, SAVE_FOCUS, UNFOCUS } from './util/constant'

let lastFocusTabId: number = undefined
const hostStart = {}
const hostCount = {}

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    const { code, host, focus } = data
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
            database.addTotal(host, now - hostStart[host])
            hostStart[host] = now
            hostCount[host] = count - 1
        }

    } else if (code === SAVE_FOCUS) {
        !!focus && database.addFocus(host, focus)
    }
    sendResponse()
})

chrome.tabs.onActivated.addListener((tabInfo: chrome.tabs.TabActiveInfo) => {
    const tabId: number = tabInfo.tabId
    chrome.tabs.sendMessage(tabId, { code: FOCUS })
    !!lastFocusTabId && chrome.tabs.sendMessage(lastFocusTabId, { code: UNFOCUS })
    lastFocusTabId = tabId
})

chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        // All windows lost focus
        !!lastFocusTabId && chrome.tabs.sendMessage(lastFocusTabId, { code: UNFOCUS })
        lastFocusTabId = undefined
    }
})
