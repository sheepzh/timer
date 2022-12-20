/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { FillFlagParam, TimerQueryParam } from "@service/timer-service"

import initAllFunction from './all-function'
import initUpgrade from './upgrade'
import TotalInfoWrapper from "./total-info"
import MergeHostWrapper from "./merge-host"
import TimeSelectWrapper from "./select/time-select"
import TypeSelectWrapper from "./select/type-select"
import timerService, { SortDirect } from "@service/timer-service"
import { t } from "@popup/locale"
// Import from i18n
import { locale } from "@i18n"
import { getDayLenth, getMonthTime, getWeekDay, getWeekTime, MILL_PER_DAY } from "@util/time"
import optionService from "@service/option-service"
import { IS_SAFARI } from "@util/constant/environment"

type FooterParam = TimerQueryParam & {
    chartTitle: string
}

const FILL_FLAG_PARAM: FillFlagParam = { iconUrl: !IS_SAFARI, alias: true }

function calculateDateRange(duration: timer.popup.Duration, weekStart: timer.option.WeekStartOption): Date | Date[] {
    const now = new Date()
    if (duration == 'today') {
        return now
    } else if (duration == 'thisWeek') {
        const weekStartAsNormal = !weekStart || weekStart === 'default'
        if (weekStartAsNormal) {
            return getWeekTime(now, locale === 'zh_CN')
        } else {
            const weekOffset: number = weekStart as number
            // Returns 0 - 6 means Monday to Sunday
            const weekDayNow = getWeekDay(now, true)
            const optionWeekDay = weekDayNow + 1
            let start: Date = undefined
            if (optionWeekDay === weekStart) {
                start = now
            } else if (optionWeekDay < weekStart) {
                const millDelta = (optionWeekDay + 7 - weekOffset) * MILL_PER_DAY
                start = new Date(now.getTime() - millDelta)
            } else {
                const millDelta = (optionWeekDay - weekOffset) * MILL_PER_DAY
                start = new Date(now.getTime() - millDelta)
            }
            return [start, now]
        }
    } else if (duration == 'thisMonth') {
        const startOfMonth = getMonthTime(now)[0]
        return [startOfMonth, now]
    }
}

class FooterWrapper {
    private afterQuery: timer.popup.QueryResultHandler
    private timeSelectWrapper: TimeSelectWrapper
    private typeSelectWrapper: TypeSelectWrapper
    private mergeHostWrapper: MergeHostWrapper
    private totalInfoWrapper: TotalInfoWrapper

    constructor(afterQuery: timer.popup.QueryResultHandler) {
        this.afterQuery = afterQuery
    }

    async init() {
        initAllFunction()
        initUpgrade()

        const query = () => this.query()

        this.timeSelectWrapper = new TimeSelectWrapper(query)
        this.typeSelectWrapper = new TypeSelectWrapper(query)
        this.mergeHostWrapper = new MergeHostWrapper(query)
        this.totalInfoWrapper = new TotalInfoWrapper()

        const option = await optionService.getAllOption()
        this.timeSelectWrapper.init(option.defaultDuration)
        // Remove total @since v1.3.4
        const defaultType = option.defaultType === 'total' ? 'focus' : option.defaultType
        this.typeSelectWrapper.init(defaultType)
        this.mergeHostWrapper.init(option.defaultMergeDomain)
        this.query()
    }

    async query() {
        const option = await optionService.getAllOption() as timer.option.PopupOption
        const itemCount = option.popupMax
        const queryParam = this.getQueryParam(option.weekStart)
        const rows = await timerService.select(queryParam, FILL_FLAG_PARAM)
        const popupRows: timer.popup.Row[] = []
        const other: timer.popup.Row = {
            host: t(msg => msg.chart.otherLabel, { count: 0 }),
            focus: 0,
            total: 0,
            date: '0000-00-00',
            time: 0,
            mergedHosts: [],
            isOther: true,
        }
        let otherCount = 0
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            if (i < itemCount) {
                popupRows.push(row)
            } else {
                other.focus += row.focus
                other.total += row.total
                otherCount++
            }
        }
        other.host = t(msg => msg.chart.otherLabel, { count: otherCount })
        popupRows.push(other)
        const type = queryParam.sort as timer.stat.Dimension
        const data = popupRows.filter(item => item[type])
        const date = queryParam.date

        const queryResult: timer.popup.QueryResult = {
            data,
            mergeHost: queryParam.mergeHost,
            type,
            date,
            dateLength: date instanceof Array ? getDayLenth(date[0], date[1]) : 1,
            chartTitle: queryParam.chartTitle
        }
        this.totalInfoWrapper.updateTotal(data, type)
        this.afterQuery?.(queryResult)
    }

    getQueryParam(weekStart: timer.option.WeekStartOption): FooterParam {
        const duration: timer.popup.Duration = this.timeSelectWrapper.getSelectedTime()
        const param: FooterParam = {
            date: calculateDateRange(duration, weekStart),
            mergeHost: this.mergeHostWrapper.mergedHost(),
            sort: this.typeSelectWrapper.getSelectedType(),
            sortOrder: SortDirect.DESC,
            chartTitle: t(msg => msg.chart.title[duration]),
            mergeDate: true,
        }
        return param
    }
}

export default FooterWrapper