import StatDatabase, { StatCondition } from "@db/stat-database"
import { resultOf } from "@util/stat"
import virtualSiteHolder from "./components/virtual-site-holder"
import whitelistHolder from "./components/whitelist-holder"

const db = new StatDatabase(chrome.storage.local)

async function addFocusTime(host: string, url: string, focusTime: number): Promise<void> {
    if (whitelistHolder.contains(host, url)) return

    const resultSet: timer.stat.ResultSet = { [host]: resultOf(focusTime, 0) }
    const virtualHosts = virtualSiteHolder.findMatched(url)
    virtualHosts.forEach(virtualHost => resultSet[virtualHost] = resultOf(focusTime, 0))

    await db.accumulateBatch(resultSet, new Date())
}

async function addOneTime(host: string, url: string) {
    if (whitelistHolder.contains(host, url)) return

    const resultSet: timer.stat.ResultSet = { [host]: resultOf(0, 1) }
    virtualSiteHolder.findMatched(url).forEach(virtualHost => resultSet[virtualHost] = resultOf(0, 1))
    await db.accumulateBatch(resultSet, new Date())
}

const getResult = (host: string, date: Date | string) => db.get(host, date)

const selectItems = (cond: StatCondition) => db.select(cond)

export default {
    addFocusTime,
    addOneTime,
    getResult,
    selectItems,
}