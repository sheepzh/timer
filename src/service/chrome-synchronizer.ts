import MetaDatabase from "@db/meta-database"
import TimerDatabase from "@db/timer-database"
import { MILL_PER_DAY } from "@util/time"

const metaDb = new MetaDatabase(chrome.storage.local)
const local = chrome.storage.local
const sync = chrome.storage.sync

async function syncData() {
    const current = new Date().getTime()
    const meta = await metaDb.getMeta()
    !meta.sync && (meta.sync = {})
    syncTimer(current, meta)
}

async function syncTimer(current: number, meta: timer.meta.ExtensionMeta) {
    const startTime = meta.sync.timer
    const endTime = current - MILL_PER_DAY
    const localDb = new TimerDatabase(local)
    const syncDb = new TimerDatabase(sync)

    const dateRange = [
        startTime ? new Date(startTime) : undefined,
        new Date(endTime)
    ]

    const localItems = await localDb.select({ date: dateRange })
    const remoteItems = await syncDb.select({ date: dateRange })

    await Promise.all(localItems.map(item => syncDb.accumulate(item.host, item.date, item)))
    await Promise.all(remoteItems.map(item => localDb.accumulate(item.host, item.date, item)))

    meta.sync.timer = current
    await metaDb.update(meta)
}

export default class ChromeSynchronizer {
    sync = syncData
}