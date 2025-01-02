import { useRequest } from "@hooks/useRequest"
import { type PopupQuery } from "@popup/common"
import { usePopupContext } from "@popup/context"
import weekHelper from "@service/components/week-helper"
import { type StatQueryParam } from "@service/stat-service"
import { getMonthTime, MILL_PER_DAY } from "@util/time"
import { defineComponent } from "vue"
import Cate from "./Cate"
import { doQuery } from "./query"
import Site from "./Site"

type DateRangeCalculator = (now: Date, num?: number) => Promise<[Date, Date]> | Date | [Date, Date]

const DATE_RANGE_CALCULATORS: { [duration in timer.option.PopupDuration]: DateRangeCalculator } = {
    today: now => now,
    yesterday: now => new Date(now.getTime() - MILL_PER_DAY),
    thisWeek: async now => {
        const [start] = await weekHelper.getWeekDate(now)
        return [start, now]
    },
    thisMonth: now => [getMonthTime(now)[0], now],
    lastDays: (now, num) => [new Date(now.getTime() - MILL_PER_DAY * (num - 1)), now],
    allTime: () => null,
}


const cvt2StatQuery = async (param: PopupQuery): Promise<StatQueryParam> => {
    const { duration, durationNum, mergeMethod, type } = param
    const stat: StatQueryParam = {
        date: await DATE_RANGE_CALCULATORS[duration]?.(new Date(), durationNum),
        mergeHost: mergeMethod === 'domain',
        mergeCate: mergeMethod === 'cate',
        sort: type,
        sortOrder: 'DESC',
        mergeDate: true,
        exclusiveVirtual: true,
    }
    return stat
}

const Percentage = defineComponent(() => {
    const { query } = usePopupContext()
    const { data } = useRequest(() => doQuery(query.value), { deps: [query] })

    return () => query.value?.mergeMethod === 'cate'
        ? <Cate value={data.value} />
        : <Site value={data.value} />
})

export default Percentage