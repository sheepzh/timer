import { isBrowserUrl, extractHostname } from "../../util/pattern"
import TimerContext, { TimeInfo } from "./context"

class CollectContext {
    realInterval: number
    timerContext: TimerContext
    hostSet: Set<string>
    /**
     * The focus host while last collection
     */
    focusHost: string

    init() {
        const now = Date.now()
        this.realInterval = now - this.timerContext.lastCollectTime
        this.timerContext.lastCollectTime = now
    }

    constructor(timerContext: TimerContext) {
        this.timerContext = timerContext
        this.hostSet = new Set()
        this.init()
    }

    collectHost(host: string) { this.hostSet.add(host) }

    resetFocusHost(focusHost: string) { this.focusHost = focusHost }

    accumulateAll() {
        const interval = this.realInterval
        this.hostSet.forEach((host: string) => {
            const info = TimeInfo.of(interval, this.focusHost === host ? interval : 0)
            this.timerContext.accumulate(host, info)
        })
    }
}

/**
 * The promise for window query
 */
function WindowPromise(window: chrome.windows.Window, context: CollectContext) {
    return new Promise(resolve => handleWindow(resolve, window, context))
}
function handleWindow(resolve: (val?: unknown) => void, window: chrome.windows.Window, context: CollectContext) {
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
function handleTab(tab: chrome.tabs.Tab, isFocusWindow: boolean, context: CollectContext) {
    const url = tab.url
    if (!url) return
    if (isBrowserUrl(url)) return
    const host = extractHostname(url).host
    if (host) {
        context.collectHost(host)
        const isFocus = isFocusWindow && tab.active
        isFocus && context.resetFocusHost(host)
    } else {
        console.log('Detect blank host:', url)
    }
}

export default class TimeCollector {
    context: CollectContext

    constructor(timerContext: TimerContext) {
        this.context = new CollectContext(timerContext)
    }

    collect() {
        this.context.init()
        if (this.context.timerContext.isPaused()) return
        chrome.windows.getAll(windows => processWindows(windows, this.context))
    }
}

async function processWindows(windows: chrome.windows.Window[], context: CollectContext) {
    context.focusHost = ''
    const windowPromises = windows.map(w => WindowPromise(w, context))
    await Promise.all(windowPromises)
    // Accumulate the time of all the hosts
    context.accumulateAll()
}