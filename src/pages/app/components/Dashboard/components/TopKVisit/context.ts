import { useLocalStorage, useProvide, useProvider, useRequest } from "@hooks"
import { computed, reactive, toRaw, watch, type Reactive, type Ref } from "vue"
import type { FilterOption } from "./common"
import statService, { type StatQueryParam } from "@service/stat-service"
import { MILL_PER_DAY } from "@util/time";

export type BizOption = {
    name: string
    value: number
    // Extensive info
    host: string
    alias?: string
}

type Context = {
    value: Ref<BizOption[]>
    filter: Reactive<FilterOption>
}

const NAMESPACE = 'dashboardTopKVisit'
const DAY_NUM = 30

export const initProvider = () => {
    const [cachedFilter, setFilterCache] = useLocalStorage<FilterOption>(
        'habit_period_filter', { topK: 6, topKChartType: 'pie' }
    )
    const filter = reactive<FilterOption>(cachedFilter)
    watch(() => filter, () => setFilterCache(toRaw(filter)), { deep: true })
    const { data: value } = useRequest(async () => {
        const now = new Date()
        const startTime: Date = new Date(now.getTime() - MILL_PER_DAY * DAY_NUM)
        const query: StatQueryParam = {
            date: [startTime, now],
            sort: "time",
            sortOrder: 'DESC',
            mergeDate: true,
        }
        const SIZE = filter.topK
        const top = (await statService.selectByPage(query, { num: 1, size: SIZE })).list
        const data: BizOption[] = top.map(({ time, siteKey, alias }) => ({
            name: alias ?? siteKey?.host ?? '',
            host: siteKey?.host ?? '',
            alias,
            value: time,
        }))
        for (let realSize = top.length; realSize < SIZE; realSize++) {
            data.push({ name: '', host: '', value: 0 })
        }
        return data
    }, {
        deps: [() => filter.topK, () => filter.topKChartType],
        defaultValue: []
    })

    useProvide<Context>(NAMESPACE, { value, filter });

    return filter
}

export const useTopKValue = () => useProvider<Context, 'value'>(NAMESPACE, "value").value

export const useTopKFilter = () => useProvider<Context, 'filter'>(NAMESPACE, "filter").filter
