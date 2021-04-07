import { openLog } from './common/logger'
import timeService from './service/timer-service'
import { FOCUS, SAVE_FOCUS, UNFOCUS } from './util/constant/message-tag'
import { isBrowserUrl } from './util/pattern'

openLog()

let lastFocusTabId: number = undefined
const hostStart = {}

chrome.runtime.onMessage.addListener((data, _, sendResponse) => {
    const { code, host, focusStart } = data
    if (!host) {
        // do nothing
    } else if (code === SAVE_FOCUS) {
        const now = new Date().getTime()
        timeService.addFocusAndTotal(host, focusStart, hostStart[host] || now)
        hostStart[host] = now
    }
    sendResponse("ok")
})

chrome.tabs.onActivated.addListener((tabInfo: chrome.tabs.TabActiveInfo) => {
    const tabId: number = tabInfo.tabId
    chrome.tabs.get(tabId, tab => {
        const url = tab.url
        // Judge has content_script
        const ofBrowser = isBrowserUrl(url)
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