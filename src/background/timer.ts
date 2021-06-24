import periodService from "../service/period-service"
import timerService from "../service/timer-service"
import { isBrowserUrl, extractHostname } from "../util/pattern"

let lastCollectTime: number
let timeMap: { [host: string]: { focus: number, run: number } } = {}
class WindowPromiseFactory {
    private windowId: number
    private hostSet: Set<string>
    private isFocusWindow: boolean
    private focusHostSetter: (val: string) => void

    private handleTab(tab: chrome.tabs.Tab) {
        const url = tab.url
        if (!url) return
        if (isBrowserUrl(url)) return
        const host = extractHostname(url).host
        if (host) {
            this.hostSet.add(host)
            this.isFocusWindow && tab.active && (this.focusHostSetter(host))
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

    constructor(windowId: number,
        hostSet: Set<string>,
        isFocusWindow: boolean,
        focusHostSetter: (val: string) => void) {

        this.windowId = windowId
        this.hostSet = hostSet
        this.isFocusWindow = isFocusWindow
        this.focusHostSetter = focusHostSetter
    }

    public produce() {
        return new Promise(resolve => this.handleWindow(resolve))
    }
}

class Timer {

    private realInterval: number

    private focusHost: string

    /**
     * Collect the time once
     */
    private collect() {
        const now = Date.now()
        this.realInterval = now - lastCollectTime
        lastCollectTime = now
        const processHost = (host: string) => {
            let data = timeMap[host]
            !data && (timeMap[host] = data = { focus: 0, run: 0 })
            this.focusHost === host && (data.focus += this.realInterval)
            data.run += this.realInterval
        }
        chrome.windows.getAll(async windows => {
            const hostSet: Set<string> = new Set()
            this.focusHost = ''
            const windowPromises = windows
                .map(w => new WindowPromiseFactory(w.id, hostSet, !!w.focused, val => this.focusHost = val))
                .map(factory => factory.produce())
            await Promise.all(windowPromises)
            hostSet.forEach(host => processHost(host))
        })
    }

    /**
     * Save data and reset
     */
    private save() {
        timerService.addFocusAndTotal(timeMap)
        const focusEntry = Object.entries(timeMap).find(([_host, { focus }]) => focus)
        // Add periodtime
        focusEntry && periodService.add(lastCollectTime, focusEntry[1].focus)
        timeMap = {}
    }

    start() {
        lastCollectTime = Date.now()
        setInterval(this.collect, 555)
        setInterval(this.save, 2048)
    }
}

export default Timer