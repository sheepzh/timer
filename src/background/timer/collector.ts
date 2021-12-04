/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { isBrowserUrl, extractHostname } from "../../util/pattern"
import CollectionContext from "./collection-context"

/**
 * The promise for window query
 */
function WindowPromise(window: chrome.windows.Window, context: CollectionContext) {
    return new Promise(resolve => handleWindow(resolve, window, context))
}
function handleWindow(resolve: (val?: unknown) => void, window: chrome.windows.Window, context: CollectionContext) {
    const windowId = window.id
    const windowFocused = !!window.focused
    chrome.tabs.query({ windowId }, tabs => {
        if (chrome.runtime.lastError) { /** prevent it from throwing error */ }
        // tabs maybe undefined
        if (!tabs) return
        tabs.forEach(tab => handleTab(tab, windowFocused, context))
        resolve()
    })
}
function handleTab(tab: chrome.tabs.Tab, isFocusWindow: boolean, context: CollectionContext) {
    const url = tab.url
    if (!url) return
    if (isBrowserUrl(url)) return
    const host = extractHostname(url).host
    if (host) {
        context.collectHost(host)
        const isFocus = isFocusWindow && tab.active
        isFocus && context.resetFocus(host, url)
    } else {
        console.log('Detect blank host:', url)
    }
}

export default class TimeCollector {
    context: CollectionContext

    constructor(context: CollectionContext) {
        this.context = context
    }

    collect() {
        this.context.init()
        if (this.context.timerContext.isPaused()) return
        chrome.windows.getAll(windows => processWindows(windows, this.context))
    }
}

async function processWindows(windows: chrome.windows.Window[], context: CollectionContext) {
    context.focusHost = ''
    const windowPromises = windows.map(w => WindowPromise(w, context))
    await Promise.all(windowPromises)
    // Accumulate the time of all the hosts
    context.accumulateAll()
}