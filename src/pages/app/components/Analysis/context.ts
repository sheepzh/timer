/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useLocalStorage, useProvide, useProvider, useRequest } from "@hooks"
import { ref, watch, type Ref } from "vue"
import { AnalysisTarget } from "./types"
import { useRoute, useRouter } from "vue-router"
import statService, { type StatQueryParam } from "@service/stat-service"

type Context = {
    target: Ref<AnalysisTarget | undefined>
    timeFormat: Ref<timer.app.TimeFormat>
    rows: Ref<timer.stat.Row[]>
}

export type AnalysisQuery = Partial<timer.site.SiteKey> & {
    cateId?: string
}

function parseQuery(): AnalysisTarget | undefined {
    // Process the query param
    const query = useRoute().query as unknown as AnalysisQuery
    useRouter().replace({ query: {} })
    const { host, type: siteType, cateId } = query
    if (cateId) return { type: 'cate', key: parseInt(cateId) }
    if (host && siteType) return { type: 'site', key: { host, type: siteType } }
    return undefined
}

async function queryRows(target: AnalysisTarget | undefined): Promise<timer.stat.Row[]> {
    if (!target?.key) return []

    let param: StatQueryParam = {
        sort: 'date',
        sortOrder: 'ASC',
    }
    if (target?.type === 'cate') {
        param.cateIds = [target.key]
        param.mergeCate = true
    } else if (target?.type === 'site') {
        const { host, type: siteType } = target.key || {}
        param.host = host
        param.mergeHost = siteType === 'merged'
        param.fullHost = true
    } else {
        return []
    }

    return await statService.select(param)
}

const NAMESPACE = 'siteAnalysis'

export const initAnalysis = () => {
    const target = ref(parseQuery())

    const [cachedFormat, setFormatCache] = useLocalStorage<timer.app.TimeFormat>('analysis_timeFormat')
    const timeFormat = ref(cachedFormat ?? 'default')
    watch(timeFormat, setFormatCache)

    const { data: rows, loading } = useRequest(() => queryRows(target.value), { deps: target, defaultValue: [] })
    useProvide<Context>(NAMESPACE, { target, timeFormat, rows })

    return { loading }
}

export const useAnalysisTarget = () => useProvider<Context, 'target'>(NAMESPACE, "target").target

export const useAnalysisTimeFormat = () => useProvider<Context, 'timeFormat'>(NAMESPACE, "timeFormat").timeFormat

export const useAnalysisRows = () => useProvider<Context, 'rows'>(NAMESPACE, "rows").rows