/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { defineComponent, watch, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import ContentContainer from "../common/ContentContainer"
import Trend from "./components/Trend"
import Filter from "./components/AnalysisFilter"
import Summary from "./components/Summary"
import statService, { StatQueryParam } from "@service/stat-service"
import './style.sass'
import { judgeVirtualFast } from "@util/pattern"
import { initProvider } from "./context"
import { useRequest } from "@hooks/useRequest"

type _Queries = {
    host: string
    merge?: '1' | '0'
}

function getSiteFromQuery(): timer.site.SiteInfo {
    // Process the query param
    const query: _Queries = useRoute().query as unknown as _Queries
    useRouter().replace({ query: {} })
    const { host, merge } = query
    // Init with queries
    if (!host) return undefined
    return { host, merged: merge === "1", virtual: judgeVirtualFast(host) }
}

async function query(site: timer.site.SiteKey): Promise<timer.stat.Row[]> {
    if (!site?.host) {
        return []
    }
    const param: StatQueryParam = {
        host: site.host,
        mergeHost: site?.merged || false,
        fullHost: true,
        sort: 'date',
        sortOrder: 'ASC'
    }
    return await statService.select(param)
}

const _default = defineComponent(() => {
    const siteFromQuery = getSiteFromQuery()
    const site = ref<timer.site.SiteKey>(siteFromQuery)
    const timeFormat = ref<timer.app.TimeFormat>('default')

    const { data: rows, refresh, loading } = useRequest<timer.stat.Row[]>(() => site.value ? query(site.value) : [])
    watch(site, refresh)

    initProvider(site, timeFormat, rows)
    return () => (
        <ContentContainer v-slots={{
            filter: () => <Filter
                site={site.value}
                timeFormat={timeFormat.value}
                onSiteChange={val => site.value = val}
                onTimeFormatChange={val => timeFormat.value = val}
            />
        }}>
            <div v-loading={loading.value}>
                <Summary />
                <Trend />
            </div>
        </ContentContainer>
    )
})

export default _default
