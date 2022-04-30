/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { DATE_FORMAT } from "@db/common/constant"
import LimitDatabase from "@db/limit-database"
import { TimeLimit } from "@entity/dao/time-limit"
import TimeLimitItem, { TimeLimitItemLike } from "@entity/dto/time-limit-item"
import { formatTime } from "@util/time"
import whitelistHolder from './components/whitelist-holder'

const storage = chrome.storage.local
const db: LimitDatabase = new LimitDatabase(storage)

export type QueryParam = {
    filterDisabled: boolean
    url: string
}

async function select(cond?: QueryParam): Promise<TimeLimitItem[]> {
    const { filterDisabled, url } = cond ? cond : { filterDisabled: undefined, url: undefined }
    const today = formatTime(new Date(), DATE_FORMAT)
    return (await db.all())
        .filter(item => filterDisabled ? item.enabled : true)
        .map(({ cond, time, enabled, wasteTime, latestDate, allowDelay }) => TimeLimitItem.builder()
            .cond(cond)
            .time(time)
            .enabled(enabled)
            .waste(latestDate === today ? wasteTime : 0)
            .allowDelay(allowDelay)
            .build()
        )
        // If use url, then test it
        .filter(item => url ? item.matches(url) : true)
}

async function update({ cond, time, enabled, allowDelay }: TimeLimitItem, rewrite?: boolean): Promise<void> {
    if (rewrite === undefined) {
        rewrite = true
    }
    const limit: TimeLimit = { cond, time, enabled, allowDelay }
    await db.save(limit, rewrite)
}

async function updateDelay(item: TimeLimitItem) {
    await db.updateDelay(item.cond, item.allowDelay)
}

function remove(cond: string): Promise<void> {
    return db.remove(cond)
}

async function getLimited(url: string): Promise<TimeLimitItem[]> {
    const list: TimeLimitItem[] = (await select())
        .filter(item => item.enabled)
        .filter(item => item.matches(url))
        .filter(item => item.hasLimited())
    return list
}

/**
 * Add time
 * @param url url 
 * @param focusTime time, milliseconds 
 * @returns the rules is limit cause of this operation
 */
async function addFocusTime(url: string, focusTime: number) {
    const allEnabled: TimeLimitItem[] = await select({ filterDisabled: true, url })
    const toUpdate: { [cond: string]: number } = {}
    const result: TimeLimitItem[] = []
    allEnabled.forEach(item => {
        const limitBefore = item.hasLimited()
        toUpdate[item.cond] = item.waste += focusTime
        const limitAfter = item.hasLimited()
        if (!limitBefore && limitAfter) {
            result.push(item)
        }
    })
    await db.updateWaste(formatTime(new Date, DATE_FORMAT), toUpdate)
    return result
}

async function moreMinutes(url: string, rules?: TimeLimitItem[]): Promise<TimeLimitItemLike[]> {
    if (rules === undefined || rules === null) {
        rules = (await select({ url: url, filterDisabled: true }))
            .filter(item => item.hasLimited() && item.allowDelay)
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
    update = update
    updateDelay = updateDelay
    select = select
    remove = remove
    /**
     * @returns The rules limited cause of this operation
     */
    async addFocusTime(host: string, url: string, focusTime: number): Promise<TimeLimitItem[]> {
        if (whitelistHolder.notContains(host)) {
            return addFocusTime(url, focusTime)
        } else {
            return []
        }
    }
}

export default new LimitService()