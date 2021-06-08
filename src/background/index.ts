import { openLog, log } from '../common/logger'
import timerService from '../service/timer-service'
import { extractHostname, isBrowserUrl } from '../util/pattern'
import versionManager from './version-manager'

openLog()


let lastLoopTime = Date.now()

let timeMap: { [host: string]: { focus: number, run: number } } = {}

setInterval(() => {
    const now = Date.now()
    const realInterval = now - lastLoopTime
    lastLoopTime = now
    let focusHost = ''
    chrome.windows.getAll(windows => {
        const hostSet: Set<string> = new Set()
        Promise.all(
            windows.map(w => {
                const isFocusWindow = !!w.focused
                return new Promise<void>(resolve => {
                    chrome.tabs.query({ windowId: w.id }, tabs => {
                        tabs.forEach(tab => {
                            const url = tab.url
                            if (isBrowserUrl(url)) return
                            const host = extractHostname(url)
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
}, 512)

setInterval(() => {
    timerService.addFocusAndTotal(timeMap)
    timeMap = {}
}, 2048)

chrome.runtime.onInstalled.addListener(detail => versionManager.onChromeInstalled(detail.reason))