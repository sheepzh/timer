import { defineComponent } from "vue"
import ChartTitle from "../../ChartTitle"
import { useEcharts } from "@hooks/useEcharts"
import Wrapper from "./Wrapper"
import { groupBy, sum } from "@util/array"
import DateIterator from "@util/date-iterator"
import { MILL_PER_DAY } from "@util/time"
import statService from "@service/stat-service"
import { t } from "@app/locale"

const PERIOD_WIDTH = 30
const TOP_NUM = 15

type Row = {
    date: string
    total: number
}

const cvtRow = (rows: timer.stat.Row[], start: Date, end: Date): Row[] => {
    const groupByDate = groupBy(rows, r => r.date, l => sum(l.map(e => e.focus ?? 0)))
    const iterator = new DateIterator(start, end)
    const result: Row[] = []
    iterator.forEach(yearMonthDate => {
        const total = groupByDate[yearMonthDate] ?? 0
        result.push({ total, date: yearMonthDate })
    })
    return result
}

const fetchData = async (): Promise<[thisMonth: Row[], lastMonth: Row[]]> => {
    const now = new Date()
    const lastPeriodStart = new Date(now.getTime() - MILL_PER_DAY * (PERIOD_WIDTH * 2 - 1))
    const lastPeriodEnd = new Date(now.getTime() - MILL_PER_DAY * PERIOD_WIDTH)
    const thisPeriodStart = new Date(now.getTime() - MILL_PER_DAY * (PERIOD_WIDTH - 1))
    const thisPeriodEnd = now

    // Query with alias
    // @since 1.1.8
    const lastPeriodItems: timer.stat.Row[] = await statService.select({ date: [lastPeriodStart, lastPeriodEnd] }, true)
    const lastRows = cvtRow(lastPeriodItems, lastPeriodStart, lastPeriodEnd)
    const thisPeriodItems: timer.stat.Row[] = await statService.select({ date: [thisPeriodStart, thisPeriodEnd] }, true)
    const thisRows = cvtRow(thisPeriodItems, thisPeriodStart, thisPeriodEnd)
    return [lastRows, thisRows]
}

const _default = defineComponent(() => {
    const { elRef } = useEcharts(Wrapper, fetchData)
    return () => (
        <div class="mom-container">
            <ChartTitle text={t(msg => msg.dashboard.monthOnMonth.title, { k: TOP_NUM })} />
            <div ref={elRef} style={{ flex: 1 }} />
        </div>
    )
})

export default _default