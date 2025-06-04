import StatDatabase, { type StatCondition } from "@db/stat-database"
import { resultOf } from "@util/stat"
import virtualSiteHolder from "./components/virtual-site-holder"

const db = new StatDatabase(chrome.storage.local)

async function addFocusTime(host: string, url: string, focusTime: number): Promise<void> {
    const resultSet: timer.stat.ResultSet = { [host]: resultOf(focusTime, 0) }
    const virtualHosts = virtualSiteHolder.findMatched(url)
    virtualHosts.forEach(virtualHost => resultSet[virtualHost] = resultOf(focusTime, 0))

    await db.accumulateBatch(resultSet, new Date())
}

async function addRunTime(host: string, dateTime: Record<string, number>) {
    for (const [date, run] of Object.entries(dateTime)) {
        await db.accumulate(host, date, { focus: 0, time: 0, run })
    }
}

async function increaseVisit(host: string, url: string) {
    const resultSet: timer.stat.ResultSet = { [host]: resultOf(0, 1) }
    virtualSiteHolder.findMatched(url).forEach(virtualHost => resultSet[virtualHost] = resultOf(0, 1))
    await db.accumulateBatch(resultSet, new Date())
}

const getResult = (host: string, date: Date | string) => db.get(host, date)

const selectItems = (cond: StatCondition) => db.select(cond)

export default {
    addFocusTime,
    addRunTime,
    increaseVisit,
    getResult,
    selectItems,
}