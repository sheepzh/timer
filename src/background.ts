import { openLog, log } from './common/logger'
import timeService from './service/timer-service'
import { HOST_START, SAVE_FOCUS, UNFOCUS } from './util/constant/message-tag'
import { isBrowserUrl } from './util/pattern'

openLog()

// issue #3: https://github.com/sheepzh/timer/issues/3
// To resolve the incorrect start of tab focus after window returnes to activated from other application
let focusStart = undefined

let lastFocusTabId: number = undefined
const hostStart = {}

chrome.runtime.onMessage.addListener((data, { tab }, sendResponse) => {
    const { code, host } = data
    const now = new Date().getTime()
    if (!host) {
        // do nothing
    } else if (code === SAVE_FOCUS) {
        timeService.addFocusAndTotal(host, focusStart, hostStart[host] || now)
        hostStart[host] = now
        focusStart = now
    } else if (code === HOST_START) {
        timeService.addFocusAndTotal(host, now, hostStart[host] || now)
        hostStart[host] = now
        focusStart = now
        lastFocusTabId = tab.id
    }
    sendResponse("ok")
})

const handleTabActivated = (tabInfo: chrome.tabs.TabActiveInfo) => {
    log(`tab activated: lastTabId=${lastFocusTabId}, tabId=${tabInfo.tabId}`)
    const tabId: number = tabInfo.tabId
    chrome.tabs.get(tabId, tab => {
        const url = tab.url
        // Judge has content_script
        const ofBrowser = isBrowserUrl(url)
        !!lastFocusTabId && chrome.tabs.sendMessage(lastFocusTabId, { code: UNFOCUS })
        lastFocusTabId = ofBrowser ? undefined : tabId
    })
}

chrome.tabs.onActivated.addListener(handleTabActivated)

chrome.windows.onFocusChanged.addListener((windowId) => {
    log(`window focus changed: windowId=${windowId}`)
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        console.log(new Date().getTime(), 'None')
        // All windows lost focus
        !!lastFocusTabId && chrome.tabs.sendMessage(lastFocusTabId, { code: UNFOCUS })
        lastFocusTabId = undefined
    } else {
        // Some tab is focused
        chrome.tabs.query({ active: true, windowId }, (tabs: chrome.tabs.Tab[]) => {
            if (tabs && tabs.length) {
                handleTabActivated({ tabId: tabs[0].id, windowId })
            } else {
                lastFocusTabId = undefined
            }
        })
    }
})