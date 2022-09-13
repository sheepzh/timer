/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import PeriodDatabase from "@db/period-database"
import { after, compare, getDateString, keyOf } from "@util/period"
import { MILL_PER_DAY } from "@util/time"
import { calculate, merge, getMaxDivisiblePeriod } from "./components/period-calculator"

const periodDatabase = new PeriodDatabase(chrome.storage.local)

export type PeriodQueryParam = {
    periodSize?: number
    /**
     * Must
     */
    periodStart: timer.period.Key
    periodEnd: timer.period.Key
}

function add(timestamp: number, milliseconds: number): Promise<void> {
    const results = calculate(timestamp, milliseconds)
    return periodDatabase.accumulate(results)
}

function dateStrBetween(startDate: timer.period.Key, endDate: timer.period.Key): string[] {
    const result = []
    while (compare(startDate, endDate) <= 0) {
        result.push(getDateString(startDate))
        startDate = after(startDate, 1)
    }
    return result
}

/**
 * preprocess the param
 * 
 * @param param param
 */
function preprocessParam(param?: PeriodQueryParam): PeriodQueryParam {
    const now = Date.now()
    const defaultParam: PeriodQueryParam = { periodSize: 1, periodStart: keyOf(now - MILL_PER_DAY), periodEnd: keyOf(now) }
    if (param) {
        param.periodSize && (defaultParam.periodSize = param.periodSize)
        param.periodStart && (defaultParam.periodStart = param.periodStart)
        param.periodEnd && (defaultParam.periodEnd = param.periodEnd)
    }
    return defaultParam
}

async function list(inParam?: PeriodQueryParam): Promise<timer.period.Row[]> {
    const param = preprocessParam(inParam)
    const start = param.periodStart
    const end = param.periodEnd
    const allDates = dateStrBetween(start, end)
    const originData: timer.period.Result[] = await periodDatabase.getBatch(allDates)

    const windowSize = param.periodSize
    if (windowSize <= 0) return []
    const maxPeriod = getMaxDivisiblePeriod(end, windowSize)
    // Get ride of the latest ones can't be merged into one window
    const realData = originData.filter(data => compare(data, maxPeriod) <= 0 && compare(data, start) >= 0)
    const mergeConfig = { start, end: maxPeriod, windowSize }
    return merge(realData, mergeConfig)
}

class PeriodService {
    add = add
    list = list
}

export default new PeriodService()
