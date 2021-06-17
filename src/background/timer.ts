import timerService from "../service/timer-service"
import { isBrowserUrl, extractHostname } from "../util/pattern"

let lastCollectTime: number
let timeMap: { [host: string]: { focus: number, run: number } } = {}

class Timer {
    /**
     * Collect the time once
     */
    private collect() {
        const now = Date.now()
        const realInterval = now - lastCollectTime
        lastCollectTime = now
        chrome.windows.getAll(windows => {
            const hostSet: Set<string> = new Set()
            let focusHost = ''
            Promise.all(
                windows.map(w => {
                    const isFocusWindow = !!w.focused
                    return new Promise<void>(resolve => {
                        chrome.tabs.query({ windowId: w.id }, tabs => {
                            tabs.forEach(tab => {
                                const url = tab.url
                                if (!url) return
                                if (isBrowserUrl(url)) return
                                const host = extractHostname(url).host
                                if (host) {
                                    hostSet.add(host)
                                    isFocusWindow && tab.active && (focusHost = host)
                                } else {
                                    console.log('Detect blank host:', url)
                                }
                            })
                            resolve()
                        })
                    })
                })
            ).then(() => {
                hostSet.forEach(host => {
                    let data = timeMap[host]
                    !data && (timeMap[host] = data = { focus: 0, run: 0 })
                    focusHost === host && (data.focus += realInterval)
                    data.run += realInterval
                })
            })
        })
    }

    /**
     * Save data and reset
     */
    private save() {
        timerService.addFocusAndTotal(timeMap)
        timeMap = {}
    }

    start() {
        lastCollectTime = Date.now()
        setInterval(this.collect, 555)
        setInterval(this.save, 2048)
    }
}

export default Timer