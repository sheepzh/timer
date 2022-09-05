/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { FillFlagParam, TimerQueryParam } from "@service/timer-service"

import initAllFunction from './all-function'
import initUpgrade from './upgrade'
import initMeat from './meat'
import TotalInfoWrapper from "./total-info"
import MergeHostWrapper from "./merge-host"
import TimeSelectWrapper from "./select/time-select"
import TypeSelectWrapper from "./select/type-select"
import timerService, { SortDirect } from "@service/timer-service"
import { locale, t } from "@popup/locale"
import { formatPeriodCommon, getMonthTime, getWeekTime } from "@util/time"
import optionService from "@service/option-service"

type FooterParam = TimerQueryParam & {
    chartTitle: string
}

const FILL_FLAG_PARAM: FillFlagParam = { iconUrl: true, alias: true }

function calculateDateRange(duration: timer.popup.Duration): Date | Date[] {
    const now = new Date()
    if (duration == 'today') {
        return now
    } else if (duration == 'thisWeek') {
        return getWeekTime(now, locale === 'zh_CN')
    } else if (duration == 'thisMonth') {
        return getMonthTime(now)
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
        initMeat()

        const query = () => this.query()

        this.timeSelectWrapper = new TimeSelectWrapper(query)
        this.typeSelectWrapper = new TypeSelectWrapper(query)
        this.mergeHostWrapper = new MergeHostWrapper(query)
        this.totalInfoWrapper = new TotalInfoWrapper()

        const option = await optionService.getAllOption()
        this.timeSelectWrapper.init(option.defaultDuration)
        this.typeSelectWrapper.init(option.defaultType)
        this.mergeHostWrapper.init()
        this.query()
    }

    async query() {
        const itemCount = (await optionService.getAllOption()).popupMax
        const queryParam = this.getQueryParam()
        const rows = await timerService.select(queryParam, FILL_FLAG_PARAM)
        const popupRows: timer.popup.Row[] = []
        const other: timer.popup.Row = {
            host: t(msg => msg.otherLabel, { count: 0 }),
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
        other.host = t(msg => msg.otherLabel, { count: otherCount })
        popupRows.push(other)
        const type = queryParam.sort as timer.stat.Dimension
        const data = popupRows.filter(item => item[type])

        const queryResult: timer.popup.QueryResult = {
            data,
            mergeHost: queryParam.mergeHost,
            type,
            date: queryParam.date,
            chartTitle: queryParam.chartTitle
        }
        this.totalInfoWrapper.updateTotal(this.getTotalInfo(data, type))
        this.afterQuery?.(queryResult)
    }

    getQueryParam(): FooterParam {
        const duration: timer.popup.Duration = this.timeSelectWrapper.getSelectedTime()
        const param: FooterParam = {
            date: calculateDateRange(duration),
            mergeHost: this.mergeHostWrapper.mergedHost(),
            sort: this.typeSelectWrapper.getSelectedType(),
            sortOrder: SortDirect.DESC,
            chartTitle: t(msg => msg.title[duration]),
            mergeDate: true,
        }
        return param
    }

    /**
     * @param data result items
     * @param type type
     * @returns total alert text
     */
    getTotalInfo(data: timer.stat.Row[], type: timer.stat.Dimension): string {
        if (type === 'time') {
            const totalCount = data.map(d => d[type] || 0).reduce((a, b) => a + b, 0)
            return t(msg => msg.totalCount, { totalCount })
        } else {
            const totalTime = formatPeriodCommon(data.map(d => d[type]).reduce((a, b) => a + b, 0))
            return t(msg => msg.totalTime, { totalTime })
        }
    }
}

export default FooterWrapper