/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import { defineComponent, h, onMounted, watch, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import ContentContainer from "../common/content-container"
import Trend from "./components/trend"
import Filter from "./components/filter"
import Summary from "./components/summary"
import statService, { StatQueryParam } from "@service/stat-service"
import './style.sass'
import { judgeVirtualFast } from "@util/pattern"

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
    if (!host) {
        return undefined
    }
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
    const site: Ref<timer.site.SiteKey> = ref(siteFromQuery)
    const timeFormat: Ref<timer.app.TimeFormat> = ref('default')
    const rows: Ref<timer.stat.Row[]> = ref()

    const queryInner = async () => {
        const siteKey = site.value
        rows.value = siteKey ? (await query(siteKey)) || [] : undefined
    }

    onMounted(() => queryInner())
    watch(site, queryInner)

    return () => h(ContentContainer, {}, {
        filter: () => h(Filter, {
            site: site.value,
            timeFormat: timeFormat.value,
            onSiteChange: (newSite: timer.site.SiteKey) => site.value = newSite,
            onTimeFormatChange: (newFormat: timer.app.TimeFormat) => timeFormat.value = newFormat
        }),
        default: () => [
            h(Summary, { site: site.value, rows: rows.value, timeFormat: timeFormat.value }),
            h(Trend, { rows: rows.value, timeFormat: timeFormat.value }),
        ]
    })
})

export default _default
