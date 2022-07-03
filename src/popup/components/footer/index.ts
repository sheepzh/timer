/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import initMergeHost, { mergedHost } from "./merge-host"

// Links
import './all-function'
import './upgrade'
import './meat'

import { updateTotal } from "./total-info"

import timerService, { FillFlagParam, SortDirect, TimerQueryParam } from "@service/timer-service"
import { locale, t } from "@popup/locale"
import QueryResult, { PopupItem } from "@popup/common/query-result"
import { formatPeriodCommon, getMonthTime, getWeekTime } from "@util/time"
import optionService from "@service/option-service"
import TimeSelectWrapper from "./select/time-select"
import TypeSelectWrapper from "./select/type-select"

type FooterParam = TimerQueryParam & {
    chartTitle: string
}

function calculateDateRange(duration: timer.PopupDuration): Date | Date[] {
    const now = new Date()
    if (duration == 'today') {
        return now
    } else if (duration == 'thisWeek') {
        return getWeekTime(now, locale === 'zh_CN')
    } else if (duration == 'thisMonth') {
        return getMonthTime(now)
    }
}

function calculateChartTitle(duration: timer.PopupDuration): string {
    return t(msg => msg.title[duration])
}

export function getQueryParam(): FooterParam {
    const duration: timer.PopupDuration = timeSelectWrapper.getSelectedTime()
    const param: FooterParam = {
        date: calculateDateRange(duration),
        mergeHost: mergedHost(),
        sort: typeSelectWrapper.getSelectedType(),
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
const getTotalInfo = (data: timer.stat.Row[], type: timer.stat.Dimension) => {
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
    const type = queryParam.sort as timer.stat.Dimension
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

const timeSelectWrapper: TimeSelectWrapper = new TimeSelectWrapper(query)
const typeSelectWrapper: TypeSelectWrapper = new TypeSelectWrapper(query)

async function init() {
    const option = await optionService.getAllOption()
    timeSelectWrapper.init(option.defaultDuration)
    typeSelectWrapper.init(option.defaultType)
    query()
    initMergeHost(query)
}

init()

export const queryInfo = query

export default _default