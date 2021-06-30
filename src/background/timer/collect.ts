import { isBrowserUrl, extractHostname } from "../../util/pattern"
import TimerContext from "./timer-context"

class CollectContext {
    realInterval: number
    timerContext: TimerContext
    hostSet: Set<string>

    private init() {
        const now = Date.now()
        this.realInterval = now - this.timerContext.lastCollectTime
        this.timerContext.lastCollectTime = now
    }

    constructor(timerContext: TimerContext) {
        this.timerContext = timerContext
        this.hostSet = new Set()
        this.init()
    }
}

/**
 * Factory to produce the promise for window query
 */
class WindowPromiseFactory {
    private windowId: number
    private context: CollectContext
    private isFocusWindow: boolean

    private handleTab(tab: chrome.tabs.Tab) {
        const url = tab.url
        if (!url) return
        if (isBrowserUrl(url)) return
        const host = extractHostname(url).host
        if (host) {
            this.context.hostSet.add(host)
            this.isFocusWindow && tab.active && (this.context.timerContext.focusHost = host)
        } else {
            console.log('Detect blank host:', url)
        }
    }

    private handleWindow(resolve: (val?: unknown) => void) {
        chrome.tabs.query({ windowId: this.windowId }, tabs => {
            tabs.forEach(tab => this.handleTab(tab))
            resolve()
        })
    }

    constructor(window: chrome.windows.Window, context: CollectContext) {
        this.windowId = window.id
        this.isFocusWindow = !!window.focused
        this.context = context
    }

    produce() {
        return new Promise(resolve => this.handleWindow(resolve))
    }
}

function accumulateAll(context: CollectContext) {
    const { hostSet, timerContext, realInterval } = context
    hostSet.forEach(host => {
        let data = timerContext.timeMap[host]
        !data && (timerContext.timeMap[host] = data = { focus: 0, run: 0 })
        timerContext.focusHost === host && (data.focus += realInterval)
        data.run += realInterval
    })
}

async function processWindows(windows: chrome.windows.Window[], context: CollectContext) {
    const { timerContext } = context
    timerContext.focusHost = ''
    const windowPromises = windows
        .map(w => new WindowPromiseFactory(w, context))
        .map(factory => factory.produce())
    await Promise.all(windowPromises)
    // Accumulate the time of all the hosts
    accumulateAll(context)
}

export default function collect(timerContext: TimerContext) {
    const context: CollectContext = new CollectContext(timerContext)
    chrome.windows.getAll(windows => processWindows(windows, context))
}
