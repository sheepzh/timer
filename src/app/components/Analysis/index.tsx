/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { defineComponent } from "vue"
import { useRoute, useRouter } from "vue-router"
import ContentContainer from "../common/ContentContainer"
import Trend from "./components/Trend"
import Filter from "./components/AnalysisFilter"
import Summary from "./components/Summary"
import statService, { StatQueryParam } from "@service/stat-service"
import './style.sass'
import { judgeVirtualFast } from "@util/pattern"
import { initProvider } from "./context"
import { useRequest, useState } from "@hooks"

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
    if (!site?.host) return []

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
    const [site, setSite] = useState(getSiteFromQuery())
    const [timeFormat, setTimeFormat] = useState<timer.app.TimeFormat>('default')

    const { data: rows, loading } = useRequest(() => query(site.value), { deps: site })

    initProvider(site, timeFormat, rows)
    return () => <ContentContainer
        v-slots={{
            filter: () => <Filter
                site={site.value}
                timeFormat={timeFormat.value}
                onSiteChange={setSite}
                onTimeFormatChange={setTimeFormat}
            />,
            default: () => <div v-loading={loading.value}>
                <Summary />
                <Trend />
            </div>
        }}
    />
})

export default _default
