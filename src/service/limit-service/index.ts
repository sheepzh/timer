/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { listTabs, sendMsg2Tab } from "@api/chrome/tab"
import { DATE_FORMAT } from "@db/common/constant"
import LimitDatabase from "@db/limit-database"
import { hasLimited, matches } from "@util/limit"
import { formatTime } from "@util/time"
import whitelistHolder from '../components/whitelist-holder'

const storage = chrome.storage.local
const db: LimitDatabase = new LimitDatabase(storage)

export type QueryParam = {
    filterDisabled: boolean
    url: string
}

async function select(cond?: QueryParam): Promise<timer.limit.Item[]> {
    const { filterDisabled, url } = cond ? cond : { filterDisabled: undefined, url: undefined }
    const today = formatTime(new Date(), DATE_FORMAT)
    return (await db.all())
        .filter(item => filterDisabled ? item.enabled : true)
        .map(({ cond, time, enabled, wasteTime, latestDate, allowDelay }) => ({
            cond,
            time,
            enabled: !!enabled,
            waste: latestDate === today ? (wasteTime ?? 0) : 0,
            latestDate,
            allowDelay: !!allowDelay,
        } as timer.limit.Item))
        // If use url, then test it
        .filter(item => !url || matches(item, url))
}

/**
 * Fired if the item is removed or disabled
 * 
 * @param item 
 */
async function handleLimitChanged() {
    const allItems: timer.limit.Item[] = await select({ filterDisabled: false, url: undefined })
    const tabs = await listTabs()
    tabs.forEach(tab => {
        const limitedItems = allItems.filter(item => matches(item, tab.url) && item.enabled && hasLimited(item))
        sendMsg2Tab(tab?.id, 'limitChanged', limitedItems)
            .catch(err => console.log(err.message))
    })
}

async function updateEnabled(item: timer.limit.Item): Promise<void> {
    const { cond, time, enabled, allowDelay } = item
    const limit: timer.limit.Rule = { cond, time, enabled, allowDelay }
    await db.save(limit, true)
    await handleLimitChanged()
}

async function updateDelay(item: timer.limit.Item) {
    await db.updateDelay(item.cond, item.allowDelay)
    await handleLimitChanged()
}

async function remove(item: timer.limit.Item): Promise<void> {
    await db.remove(item.cond)
    await handleLimitChanged()
}

async function getLimited(url: string): Promise<timer.limit.Item[]> {
    const list: timer.limit.Item[] = (await select())
        .filter(item => item.enabled)
        .filter(item => matches(item, url))
        .filter(item => hasLimited(item))
    return list
}

/**
 * Add time
 * @param url url 
 * @param focusTime time, milliseconds 
 * @returns the rules is limit cause of this operation
 */
async function addFocusTime(url: string, focusTime: number) {
    const allEnabled: timer.limit.Item[] = await select({ filterDisabled: true, url })
    const toUpdate: { [cond: string]: number } = {}
    const result: timer.limit.Item[] = []
    allEnabled.forEach(item => {
        const limitBefore = hasLimited(item)
        toUpdate[item.cond] = item.waste += focusTime
        const limitAfter = hasLimited(item)
        if (!limitBefore && limitAfter) {
            result.push(item)
        }
    })
    await db.updateWaste(formatTime(new Date, DATE_FORMAT), toUpdate)
    return result
}

async function moreMinutes(url: string, rules?: timer.limit.Item[]): Promise<timer.limit.Item[]> {
    if (rules === undefined || rules === null) {
        rules = (await select({ url: url, filterDisabled: true }))
            .filter(item => hasLimited(item) && item.allowDelay)
    }
    const date = formatTime(new Date(), DATE_FORMAT)
    const toUpdate: { [cond: string]: number } = {}
    rules.forEach(rule => {
        const { cond, waste } = rule
        const updatedWaste = (waste || 0) - 5 * 60 * 1000
        rule.waste = toUpdate[cond] = updatedWaste < 0 ? 0 : updatedWaste
    })
    await db.updateWaste(date, toUpdate)
    return rules
}

class LimitService {
    moreMinutes = moreMinutes
    getLimited = getLimited
    updateEnabled = updateEnabled
    updateDelay = updateDelay
    select = select
    remove = remove
    /**
     * @returns The rules limited cause of this operation
     */
    async addFocusTime(host: string, url: string, focusTime: number): Promise<timer.limit.Item[]> {
        if (whitelistHolder.notContains(host)) {
            return addFocusTime(url, focusTime)
        } else {
            return []
        }
    }
}

export default new LimitService()
