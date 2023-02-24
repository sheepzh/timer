import { listTabs, sendMsg2Tab } from "@api/chrome/tab"
import { getWindow } from "@api/chrome/window"
import limitService from "@service/limit-service"
import periodService from "@service/period-service"
import timerService from "@service/timer-service"
import { extractHostname, HostInfo } from "@util/pattern"
import badgeTextManager from "../badge-text-manager"
import MessageDispatcher from "../message-dispatcher"

async function handleTime(hostInfo: HostInfo, url: string, dateRange: [number, number]): Promise<number> {
    const host = hostInfo.host
    const [start, end] = dateRange
    const focusTime = end - start
    // 1. Saveasync
    const totalFocus = await timerService.addFocus(host, new Date(end), focusTime)
    // 2. Process limit
    const meedLimits = await limitService.addFocusTime(host, url, focusTime)
    // If time limited after this operation, send messages
    meedLimits && meedLimits.length && sendLimitedMessage(meedLimits)
    // 3. Add period time
    await periodService.add(start, focusTime)
    return totalFocus
}

async function handleEvent(event: timer.stat.Event, sender: ChromeMessageSender): Promise<void> {
    const { url, start, end, ignoreTabCheck } = event
    const windowId = sender?.tab?.windowId
    if (!ignoreTabCheck) {
        if (!windowId) return
        const window = await getWindow(windowId)
        if (!window?.focused) return
    }
    const hostInfo = extractHostname(url)
    const focus = await handleTime(hostInfo, url, [start, end])
    const tabId = sender?.tab?.id
    tabId && badgeTextManager.forceUpdate({ tabId, url, focus })
}

async function sendLimitedMessage(item: timer.limit.Item[]) {
    const tabs = await listTabs({ status: 'complete' })
    tabs.forEach(tab => sendMsg2Tab(tab.id, 'limitTimeMeet', item)
        .then(() => console.log(`Processed limit rules: rule=${JSON.stringify(item)}`))
        .catch(err => console.error(`Failed to execute limit rule: rule=${JSON.stringify(item)}, msg=${err.msg}`))
    )
}

export default function initServer(messageDispatcher: MessageDispatcher) {
    messageDispatcher.register<timer.stat.Event, void>('cs.trackTime', handleEvent)
}
