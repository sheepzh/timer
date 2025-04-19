import { useLocalStorage, useProvide, useProvider } from "@hooks"
import { reactive, type Reactive, ref, type Ref, toRaw, watch } from "vue"
import { type RouteLocation, type Router, useRoute, useRouter } from "vue-router"
import type { DisplayComponent, ReportFilterOption, ReportQueryParam, ReportSort } from "./types"

type Context = {
    filter: Reactive<ReportFilterOption>
    sort: Ref<ReportSort>
    comp: Ref<DisplayComponent | undefined>
}

const NAMESPACE = 'report'

type QueryPartial = Partial<Pick<ReportFilterOption, 'dateRange' | 'mergeDate' | 'siteMerge'>>

/**
 * Init the query parameters
 */
function parseQuery(route: RouteLocation, router: Router): [QueryPartial, ReportSort['prop'] | undefined] {
    const routeQuery = route.query as unknown as ReportQueryParam
    const { mh, md, ds, de, sc } = routeQuery
    const dateStart = ds ? new Date(Number.parseInt(ds)) : undefined
    const dateEnd = de ? new Date(Number.parseInt(de)) : undefined
    // Remove queries
    router.replace({ query: {} })

    let siteMerge: ReportFilterOption['siteMerge']
    if (mh === "true" || mh === "1") siteMerge = 'domain'

    const now = new Date()
    const partial: QueryPartial = {
        ...((md === 'true' || md === '1') && { mergeDate: true }),
        ...((dateStart ?? dateEnd) && { dateRange: [dateStart ?? now, dateEnd ?? now] }),
        ...(siteMerge && { siteMerge })
    }
    return [partial, sc ? sc satisfies ReportSort['prop'] : undefined]
}

type FilterStorageValue = Omit<ReportFilterOption, 'dateRange' | 'readRemote'> & {
    dateStart?: number
    dateEnd?: number
}

const cvtStorage2Filter = (storage: FilterStorageValue | undefined): ReportFilterOption => {
    const { host, dateStart, dateEnd, mergeDate, siteMerge, cateIds, timeFormat } = storage || {}
    const now = new Date()
    return {
        host,
        dateRange: [dateStart ? new Date(dateStart) : now, dateEnd ? new Date(dateEnd) : now],
        mergeDate: mergeDate ?? false,
        siteMerge,
        cateIds,
        timeFormat: timeFormat ?? 'default',
        readRemote: false,
    }
}

const cvtFilter2Storage = (filter: ReportFilterOption): FilterStorageValue => {
    const { host, dateRange, mergeDate, siteMerge, cateIds, timeFormat } = filter
    return {
        host,
        mergeDate, siteMerge,
        dateStart: dateRange?.[0]?.getTime?.(),
        dateEnd: dateRange?.[1]?.getTime?.(),
        cateIds, timeFormat,
    }
}

export const initReportContext = () => {
    const route = useRoute()
    const router = useRouter()
    const [queryFilter, querySort] = parseQuery(route, router)

    const [cachedFilter, setCachedFilter] = useLocalStorage<FilterStorageValue>('report_filter')

    const initialFilter: ReportFilterOption = { ...cvtStorage2Filter(cachedFilter), ...queryFilter }
    const filter = reactive(initialFilter)
    watch(() => filter, v => setCachedFilter(cvtFilter2Storage(toRaw(v))), { deep: true })

    const sort = ref<ReportSort>({
        order: 'descending',
        prop: querySort || 'focus'
    })

    const comp = ref<DisplayComponent>()

    const context: Context = { filter, sort, comp }
    useProvide<Context>(NAMESPACE, context)

    return context
}

export const useReportFilter = (): Reactive<ReportFilterOption> => useProvider<Context, 'filter'>(NAMESPACE, "filter").filter

export const useReportSort = (): Ref<ReportSort> => useProvider<Context, 'sort'>(NAMESPACE, 'sort').sort

export const useReportComponent = () => useProvider<Context, 'comp'>(NAMESPACE, 'comp').comp