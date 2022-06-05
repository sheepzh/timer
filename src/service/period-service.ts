/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import PeriodDatabase from "@db/period-database"
import PeriodInfo, { PeriodKey } from "@entity/dto/period-info"
import PeriodResult from "@entity/dto/period-result"
import { MILL_PER_DAY } from "@util/time"
import { calculate, merge, getMaxDivisiblePeriod } from "./components/period-calculator"

const periodDatabase = new PeriodDatabase(chrome.storage.local)

export type PeriodQueryParam = {
    periodSize?: number
    /**
     * Must
     */
    periodStart: PeriodKey
    periodEnd: PeriodKey
}

function add(timestamp: number, milliseconds: number): Promise<void> {
    const results = calculate(timestamp, milliseconds)
    return periodDatabase.accumulate(results)
}

function dateStrBetween(startDate: PeriodKey, endDate: PeriodKey): string[] {
    const result = []
    while (startDate.compare(endDate) <= 0) {
        result.push(startDate.getDateString())
        startDate = startDate.after(1)
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
    const defaultParam: PeriodQueryParam = { periodSize: 1, periodStart: PeriodKey.of(now - MILL_PER_DAY), periodEnd: PeriodKey.of(now) }
    if (param) {
        param.periodSize && (defaultParam.periodSize = param.periodSize)
        param.periodStart && (defaultParam.periodStart = param.periodStart)
        param.periodEnd && (defaultParam.periodEnd = param.periodEnd)
    }
    return defaultParam
}

async function list(inParam?: PeriodQueryParam): Promise<PeriodResult[]> {
    const param = preprocessParam(inParam)
    const start = param.periodStart
    const end = param.periodEnd
    const allDates = dateStrBetween(start, end)
    const originData: PeriodInfo[] = await periodDatabase.getBatch(allDates)

    const windowSize = param.periodSize
    if (windowSize <= 0) return []
    const maxPeriod = getMaxDivisiblePeriod(end, windowSize)
    // Get ride of the latest ones can't be merged into one window
    const realData = originData.filter(data => data.compare(maxPeriod) <= 0 && data.compare(start) >= 0)
    const mergeConfig = { start, end: maxPeriod, windowSize }
    return merge(realData, mergeConfig)
}

class PeriodService {
    add = add
    list = list
}

export default new PeriodService()
