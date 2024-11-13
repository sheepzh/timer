/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { PopupQueryResult, PopupRow } from "@popup/common"
import type { StatQueryParam } from "@service/stat-service"

import { t } from "@popup/locale"
import weekHelper from "@service/components/week-helper"
import optionService from "@service/option-service"
import statService from "@service/stat-service"
import { getDayLength, getMonthTime, MILL_PER_DAY } from "@util/time"
import initAllFunction from './all-function'
import MergeHostWrapper from "./merge-host"
import TimeSelectWrapper from "./select/time-select"
import TypeSelectWrapper from "./select/type-select"
import TotalInfoWrapper from "./total-info"
import initUpgrade from './upgrade'

type FooterParam = StatQueryParam & {
    chartTitle: string
}

type QueryResultHandler = (result: PopupQueryResult) => void

type DateRangeCalculator = (now: Date) => Promise<Date | [Date, Date]> | Date | [Date, Date]

const dateRangeCalculators: { [duration in timer.option.PopupDuration]: DateRangeCalculator } = {
    today: now => now,
    thisWeek: async now => {
        const [start] = await weekHelper.getWeekDate(now)
        console.log(start)
        return [start, now]
    },
    thisMonth: now => [getMonthTime(now)[0], now],
    last30Days: now => [new Date(now.getTime() - MILL_PER_DAY * 29), now],
    allTime: () => null,
}

const otherPopupRow = (): PopupRow => ({
    host: t(msg => msg.chart.otherLabel, { count: 0 }),
    focus: 0,
    date: '0000-00-00',
    time: 0,
    mergedHosts: [],
    isOther: true,
    virtual: false
})

class FooterWrapper {
    private afterQuery: QueryResultHandler
    private timeSelectWrapper: TimeSelectWrapper
    private typeSelectWrapper: TypeSelectWrapper
    private mergeHostWrapper: MergeHostWrapper
    private totalInfoWrapper: TotalInfoWrapper

    constructor(afterQuery: QueryResultHandler) {
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
        const defaultType = option.defaultType
        this.typeSelectWrapper.init(defaultType)
        this.mergeHostWrapper.init(option.defaultMergeDomain)
        this.query()
    }

    async query() {
        const option = await optionService.getAllOption()
        const itemCount = option.popupMax
        const queryParam = await this.getQueryParam()
        const rows = await statService.select(queryParam, true)
        const popupRows: PopupRow[] = []
        const other = otherPopupRow()
        let otherCount = 0
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            if (i < itemCount) {
                popupRows.push(row)
            } else {
                other.focus += row.focus
                otherCount++
            }
        }
        other.host = t(msg => msg.chart.otherLabel, { count: otherCount })
        popupRows.push(other)
        const type = queryParam.sort as timer.stat.Dimension
        const data = popupRows.filter(item => item[type])
        const date = queryParam.date
        let mixDate: string, maxDate: string
        rows.flatMap(r => r.mergedDates || []).map(d => {
            if (!mixDate || d < mixDate) mixDate = d
            if (!maxDate || d > maxDate) maxDate = d
        })

        const queryResult: PopupQueryResult = {
            data,
            dataDate: [mixDate, maxDate],
            mergeHost: queryParam.mergeHost,
            type,
            date,
            dateLength: date instanceof Array ? getDayLength(date[0], date[1]) : 1,
            chartTitle: queryParam.chartTitle
        }
        this.totalInfoWrapper.updateTotal(data, type)
        this.afterQuery?.(queryResult)
    }

    async getQueryParam(): Promise<FooterParam> {
        const duration = this.timeSelectWrapper.getSelectedTime()
        const param: FooterParam = {
            date: await dateRangeCalculators[duration]?.(new Date()),
            mergeHost: this.mergeHostWrapper.mergedHost(),
            sort: this.typeSelectWrapper.getSelectedType(),
            sortOrder: 'DESC',
            chartTitle: t(msg => msg.chart.title[duration]),
            mergeDate: true,
            exclusiveVirtual: true,
        }
        return param
    }
}

export default FooterWrapper