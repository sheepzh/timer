/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import initTypeSelect, { getSelectedType } from "./select/type-select"
import initTimeSelect, { getSelectedTime } from "./select/time-select"
import initMergeHost, { mergedHost } from "./merge-host"

// Links
import './all-function'
import './upgrade'
import './meat'

import { updateTotal } from "./total-info"

import timerService, { FillFlagParam, SortDirect, TimerQueryParam } from "@service/timer-service"
import DataItem from "@entity/dto/data-item"
import { locale, t } from "@popup/locale"
import QueryResult, { PopupItem } from "@popup/common/query-result"
import { formatPeriodCommon, getMonthTime, getWeekTime } from "@util/time"
import optionService from "@service/option-service"

type FooterParam = TimerQueryParam & {
    chartTitle: string
}

function calculateDateRange(duration: Timer.PopupDuration): Date | Date[] {
    const now = new Date()
    if (duration == 'today') {
        return now
    } else if (duration == 'thisWeek') {
        return getWeekTime(now, locale === 'zh_CN')
    } else if (duration == 'thisMonth') {
        return getMonthTime(now)
    }
}

function calculateChartTitle(duration: Timer.PopupDuration): string {
    return t(msg => msg.title[duration])
}

export function getQueryParam(): FooterParam {
    const duration: Timer.PopupDuration = getSelectedTime()
    const param: FooterParam = {
        date: calculateDateRange(duration),
        mergeHost: mergedHost(),
        sort: getSelectedType(),
        sortOrder: SortDirect.DESC,
        chartTitle: calculateChartTitle(duration),
        mergeDate: true,
    }
    return param
}

let afterQuery: (result: QueryResult) => void

function _default(handleQuery: (result: QueryResult) => void) {
    afterQuery = handleQuery
}

/**
 * @param data result items
 * @param type type
 * @returns total alert text
 */
const getTotalInfo = (data: DataItem[], type: Timer.DataDimension) => {
    if (type === 'time') {
        const totalCount = data.map(d => d[type] || 0).reduce((a, b) => a + b, 0)
        return t(msg => msg.totalCount, { totalCount })
    } else {
        const totalTime = formatPeriodCommon(data.map(d => d[type]).reduce((a, b) => a + b, 0))
        return t(msg => msg.totalTime, { totalTime })
    }
}

const FILL_FLAG_PARAM: FillFlagParam = { iconUrl: true, alias: true }

async function query() {
    const itemCount = (await optionService.getAllOption()).popupMax
    const queryParam = getQueryParam()
    const rows = await timerService.select(queryParam, FILL_FLAG_PARAM)
    const result: PopupItem[] = []
    const other: PopupItem = {
        host: t(msg => msg.otherLabel),
        focus: 0,
        total: 0,
        date: '0000-00-00',
        time: 0,
        mergedHosts: [],
        isOther: true,
    }
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        if (i < itemCount) {
            result.push(row)
        } else {
            other.focus += row.focus
            other.total += row.total
        }
    }
    result.push(other)
    const type = queryParam.sort as Timer.DataDimension
    const data = result.filter(item => item[type])

    const queryResult: QueryResult = {
        data,
        mergeHost: queryParam.mergeHost,
        type,
        date: queryParam.date,
        chartTitle: queryParam.chartTitle
    }
    updateTotal(getTotalInfo(data, type))
    afterQuery?.(queryResult)
}

query()

initTypeSelect(query)
initTimeSelect(query)
initMergeHost(query)

export const queryInfo = query

export default _default