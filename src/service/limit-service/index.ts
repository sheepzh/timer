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
    id?: number
    url?: string
}

async function select(cond?: QueryParam): Promise<timer.limit.Item[]> {
    const { filterDisabled, url, id } = cond || {}
    const today = formatTime(new Date(), DATE_FORMAT)
    return (await db.all())
        .filter(item => filterDisabled ? item.enabled : true)
        .filter(item => !id || id === item?.id)
        .map(({ latestDate, wasteTime, ...others }) => ({
            ...others,
            waste: latestDate === today ? (wasteTime ?? 0) : 0,
        } satisfies timer.limit.Item))
        // If use url, then test it
        .filter(item => !url || matches(item, url))
}

async function noticePeriodChanged() {
    const tabs = await listTabs()
    tabs.forEach(tab => sendMsg2Tab(tab?.id, 'limitPeriodChange', undefined)
        .catch(err => console.log(err.message))
    )
}

/**
 * Fired if the item is removed or disabled
 *
 * @param item
 */
async function noticeLimitChanged() {
    const allItems: timer.limit.Item[] = await select({ filterDisabled: false, url: undefined })
    const tabs = await listTabs()
    tabs.forEach(tab => {
        const limitedItems = allItems.filter(item => matches(item, tab.url) && item.enabled && hasLimited(item))
        sendMsg2Tab(tab?.id, 'limitChanged', limitedItems)
            .catch(err => console.log(err.message))
    })
}

async function updateEnabled(item: timer.limit.Item): Promise<void> {
    const { id, name, cond, time, enabled, allowDelay, visitTime, periods } = item
    const limit: timer.limit.Rule = { id, name, cond, time, enabled, allowDelay, visitTime, periods }
    await db.save(limit, true)
    await noticeLimitChanged()
    await noticePeriodChanged()
}

async function updateDelay(item: timer.limit.Item) {
    await db.updateDelay(item.id, item.allowDelay)
    await noticeLimitChanged()
}

async function remove(item: timer.limit.Item): Promise<void> {
    await db.remove(item.id)
    await noticeLimitChanged()
    await noticePeriodChanged()
}

async function getLimited(url: string): Promise<timer.limit.Item[]> {
    const list: timer.limit.Item[] = (await select())
        .filter(item => item.enabled)
        .filter(item => matches(item, url))
        .filter(item => hasLimited(item))
    return list
}

async function getRelated(url: string): Promise<timer.limit.Item[]> {
    return (await select())
        .filter(item => item.enabled)
        .filter(item => matches(item, url))
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
        toUpdate[item.id] = item.waste += focusTime
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
    const toUpdate: { [id: number]: number } = {}
    rules.forEach(rule => {
        const { id, waste } = rule
        const updatedWaste = (waste || 0) - 5 * 60 * 1000
        rule.waste = toUpdate[id] = updatedWaste < 0 ? 0 : updatedWaste
    })
    await db.updateWaste(date, toUpdate)
    return rules
}

async function update(rule: timer.limit.Rule) {
    await db.save(rule, true)
    await noticeLimitChanged()
    await noticePeriodChanged()
}

async function create(rule: timer.limit.Rule) {
    await db.save(rule, false)
    await noticePeriodChanged()
}

class LimitService {
    moreMinutes = moreMinutes
    getLimited = getLimited
    getRelated = getRelated
    updateEnabled = updateEnabled
    updateDelay = updateDelay
    select = select
    remove = remove
    update = update
    create = create
    /**
     * @returns The rules limited cause of this operation
     */
    async addFocusTime(host: string, url: string, focusTime: number): Promise<timer.limit.Item[]> {
        if (whitelistHolder.contains(host, url)) return []
        return addFocusTime(url, focusTime)
    }
}

export default new LimitService()
