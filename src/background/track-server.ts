import { getTab, listTabs, sendMsg2Tab } from "@api/chrome/tab"
import { getWindow } from "@api/chrome/window"
import optionHolder from "@service/components/option-holder"
import itemService from "@service/item-service"
import limitService from "@service/limit-service"
import periodService from "@service/period-service"
import { extractHostname } from "@util/pattern"
import { formatTimeYMD, getStartOfDay, MILL_PER_DAY } from "@util/time"
import badgeManager from "./badge-manager"
import MessageDispatcher from "./message-dispatcher"

async function handleTime(host: string, url: string, dateRange: [number, number], tabId: number): Promise<number> {
    const [start, end] = dateRange
    const focusTime = end - start
    // 1. Save async
    await itemService.addFocusTime(host, url, focusTime)
    // 2. Process limit
    const { limited, reminder } = await limitService.addFocusTime(host, url, focusTime)
    // If time limited after this operation, send messages
    limited?.length && sendLimitedMessage(limited)
    // If need to reminder, send messages
    reminder?.items?.length && sendMsg2Tab(tabId, 'limitReminder', reminder)
    // 3. Add period time
    await periodService.add(start, focusTime)
    return focusTime
}

async function handleTrackTimeEvent(event: timer.core.Event, sender: ChromeMessageSender): Promise<void> {
    const { url, start, end, ignoreTabCheck } = event
    const windowId = sender?.tab?.windowId
    const tabId = sender?.tab?.id
    if (!ignoreTabCheck) {
        if (!windowId || !tabId) return
        const window = await getWindow(windowId)
        if (!window?.focused) return
        const tab = await getTab(tabId)
        if (!tab?.active) return
    }
    const { protocol, host } = extractHostname(url) || {}
    const option = await optionHolder.get()
    if (protocol === "file" && !option?.countLocalFiles) return
    await handleTime(host, url, [start, end], tabId)
    if (tabId) {
        const winTabs = await listTabs({ active: true, windowId })
        const firstActiveTab = winTabs?.[0]
        // Cause there is no way to determine whether this tab is selected in screen-split mode
        // So only show badge for first tab for screen-split mode
        // @see #246
        firstActiveTab?.id === tabId && badgeManager.updateFocus({ tabId, url })
    }
}

async function sendLimitedMessage(items: timer.limit.Item[]) {
    const tabs = await listTabs()
    if (!tabs?.length) return
    for (const tab of tabs) {
        try {
            await sendMsg2Tab(tab.id, 'limitTimeMeet', items)
        } catch {
            /* Ignored */
        }
    }
}

async function handleVisit(host: string, url: string) {
    await itemService.increaseVisit(host, url)
    const metLimits = await limitService.incVisit(host, url)
    // If time limited after this operation, send messages
    metLimits?.length && sendLimitedMessage(metLimits)
}

async function handleIncVisitEvent(param: { host: string, url: string }): Promise<void> {
    const { host, url } = param || {}
    const { protocol } = extractHostname(url) || {}
    const option = await optionHolder.get()
    if (protocol === "file" && !option.countLocalFiles) return
    await handleVisit(host, url)
}

function splitRunTime(start: number, end: number): Record<string, number> {
    const res: Record<string, number> = {}
    while (start < end) {
        const startOfNextDay = getStartOfDay(new Date(start)).getTime() + MILL_PER_DAY
        const newStart = Math.min(end, startOfNextDay)
        const runTime = newStart - start
        runTime && (res[formatTimeYMD(start)] = runTime)
        start = newStart
    }
    return res
}

const RUN_TIME_END_CACHE: { [host: string]: number } = {}

async function handleTrackRunTimeEvent(event: timer.core.Event): Promise<void> {
    const { start, end, url, host } = event || {}
    if (!host || !start || !end) return
    const realStart = Math.max(RUN_TIME_END_CACHE[host] ?? 0, start)
    const byDate = splitRunTime(realStart, end)
    if (!Object.keys(byDate).length) return
    await itemService.addRunTime(host, url, byDate)
    RUN_TIME_END_CACHE[host] = Math.max(end, realStart)
}

export default function initTrackServer(messageDispatcher: MessageDispatcher) {
    messageDispatcher
        .register<timer.core.Event, void>('cs.trackTime', handleTrackTimeEvent)
        .register<timer.core.Event, void>('cs.trackRunTime', handleTrackRunTimeEvent)
        .register<{ host: string, url: string }, void>('cs.incVisitCount', handleIncVisitEvent)
        .register<string, timer.core.Result>('cs.getTodayInfo', host => itemService.getResult(host, new Date()))
}
