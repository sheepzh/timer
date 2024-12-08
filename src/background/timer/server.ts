import { getTab, listTabs, sendMsg2Tab } from "@api/chrome/tab"
import { getWindow } from "@api/chrome/window"
import itemService from "@service/item-service"
import limitService from "@service/limit-service"
import optionService from "@service/option-service"
import periodService from "@service/period-service"
import { extractHostname } from "@util/pattern"
import badgeManager from "../badge-manager"
import MessageDispatcher from "../message-dispatcher"

let option = null
optionService.getAllOption().then(opt => option = opt)
optionService.addOptionChangeListener(opt => option = opt)

async function handleTime(host: string, url: string, dateRange: [number, number]): Promise<number> {
    const [start, end] = dateRange
    const focusTime = end - start
    // 1. Save async
    await itemService.addFocusTime(host, url, focusTime)
    // 2. Process limit
    const metLimits = await limitService.addFocusTime(host, url, focusTime)
    // If time limited after this operation, send messages
    metLimits?.length && sendLimitedMessage(metLimits)
    // 3. Add period time
    await periodService.add(start, focusTime)
    return focusTime
}

async function handleEvent(event: timer.stat.Event, sender: ChromeMessageSender): Promise<void> {
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
    if (protocol === "file" && !option.countLocalFiles) return
    await handleTime(host, url, [start, end])
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
    const tabs = await listTabs({ status: 'complete' })
    tabs.forEach(tab => sendMsg2Tab(tab.id, 'limitTimeMeet', items)
        .then(() => console.log(`Processed limit rules: rule=${JSON.stringify(items)}`))
        .catch(() => {/*Ignored*/ })
    )
}

export default function initTrackServer(messageDispatcher: MessageDispatcher) {
    messageDispatcher.register<timer.stat.Event, void>('cs.trackTime', handleEvent)
}
