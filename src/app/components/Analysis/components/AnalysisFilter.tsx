/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElOption, ElSelect, ElTag } from "element-plus"
import { type PropType, watch, defineComponent } from "vue"
import statService, { HostSet } from "@service/stat-service"
import siteService from "@service/site-service"
import { t } from "@app/locale"
import TimeFormatFilterItem from "@app/components/common/TimeFormatFilterItem"
import { labelOfHostInfo } from "../util"
import { useRequest, useState } from "@hooks"

const calcUniqueKey = ({ host, virtual, merged }: timer.site.SiteInfo) => `${host}${virtual ? 1 : 0}${merged ? 1 : 0}`

async function fetchDomain(queryStr: string): Promise<timer.site.SiteInfo[]> {
    if (!queryStr) return []

    const options: Record<string, timer.site.SiteInfo> = {}
    const sites = await siteService.selectAll({ fuzzyQuery: queryStr })
    const hosts: HostSet = await statService.listHosts(queryStr)

    sites.forEach(site => options[calcUniqueKey(site)] = site)

    const { origin, merged, virtual } = hosts
    const originSiteInfo: timer.site.SiteInfo[] = []
    origin.forEach(host => originSiteInfo.push({ host }))
    merged.forEach(host => originSiteInfo.push({ host, merged: true }))
    virtual.forEach(host => originSiteInfo.push({ host, virtual: true }))
    originSiteInfo.forEach(o => {
        const key = calcUniqueKey(o)
        !options[key] && (options[key] = o)
    })
    return Object.values(options)
}

const HOST_PLACEHOLDER = t(msg => msg.analysis.common.hostPlaceholder)

function calcKey(option: timer.site.SiteKey): string {
    const { merged, virtual, host } = option
    let prefix = '_'
    merged && (prefix = 'm')
    virtual && (prefix = 'v')
    return `${prefix}${host || ''}`
}

function calcSite(key: string): timer.site.SiteKey {
    if (!key?.length) return undefined
    const prefix = key.charAt(0)
    return { host: key.substring(1), merged: prefix === 'm', virtual: prefix === 'v' }
}

const MERGED_TAG_TXT = t(msg => msg.analysis.common.merged)
const VIRTUAL_TAG_TXT = t(msg => msg.analysis.common.virtual)

const SiteOptionTag = defineComponent({
    props: {
        text: String,
    },
    setup: ({ text }) => {
        return () => (
            <span style={{ float: "right", height: "34px" }}>
                <ElTag size="small">{text}</ElTag>
            </span>
        )
    }
})

const _default = defineComponent({
    props: {
        site: Object as PropType<timer.site.SiteKey>,
        timeFormat: String as PropType<timer.app.TimeFormat>
    },
    emits: {
        siteChange: (_site: timer.site.SiteKey) => true,
        timeFormatChange: (_format: timer.app.TimeFormat) => true,
    },
    setup(props, ctx) {
        const defaultSite: timer.site.SiteKey = props.site
        const [domainKey, setDomainKey] = useState(defaultSite ? calcKey(defaultSite) : '')
        const { data: trendDomainOptions, loading: trendSearching, refresh: searchRemote } = useRequest<string, timer.site.SiteInfo[]>(
            fetchDomain,
            { defaultValue: defaultSite ? [defaultSite] : [], manual: true }
        )
        const [timeFormat, setTimeFormat] = useState(props.timeFormat)
        watch(domainKey, () => ctx.emit('siteChange', calcSite(domainKey.value)))
        watch(timeFormat, () => ctx.emit('timeFormatChange', timeFormat.value))

        return () => <>
            <ElSelect
                placeholder={HOST_PLACEHOLDER}
                class="filter-item"
                modelValue={domainKey.value}
                filterable
                remote
                loading={trendSearching.value}
                clearable
                remoteMethod={searchRemote}
                onChange={setDomainKey}
                onClear={() => setDomainKey()}
            >
                {(trendDomainOptions.value || [])?.map(
                    site => (
                        <ElOption
                            value={calcKey(site)}
                            label={labelOfHostInfo(site)}
                        >
                            <span>{site.host}</span>
                            {site.alias && <ElTag size="small" type="info">{site.alias}</ElTag>}
                            {site.merged && <SiteOptionTag text={MERGED_TAG_TXT} />}
                            {site.virtual && <SiteOptionTag text={VIRTUAL_TAG_TXT} />}
                        </ElOption>
                    )
                )}
            </ElSelect>
            <TimeFormatFilterItem
                defaultValue={timeFormat.value}
                onChange={setTimeFormat}
            />
        </>
    }
})

export default _default