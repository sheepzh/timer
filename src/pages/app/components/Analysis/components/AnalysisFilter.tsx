/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { SELECT_WRAPPER_STYLE } from "@app/components/common/filter/common"
import TimeFormatFilterItem from "@app/components/common/filter/TimeFormatFilterItem"
import { t } from "@app/locale"
import { useManualRequest, useState } from "@hooks"
import Flex from "@pages/components/Flex"
import siteService from "@service/site-service"
import statService, { type HostSet } from "@service/stat-service"
import { ElOption, ElSelect, ElTag } from "element-plus"
import { defineComponent, type PropType, watch } from "vue"
import { labelOfHostInfo } from "../util"

const calcUniqueKey = ({ host, type }: timer.site.SiteInfo) => `${host}${type === 'virtual' ? 1 : 0}${type === 'merged' ? 1 : 0}`

async function fetchDomain(queryStr: string): Promise<timer.site.SiteInfo[]> {
    if (!queryStr) return []

    const options: Record<string, timer.site.SiteInfo> = {}
    const sites = await siteService.selectAll({ fuzzyQuery: queryStr })
    const hosts: HostSet = await statService.listHosts(queryStr)

    sites.forEach(site => options[calcUniqueKey(site)] = site)

    const { origin, merged, virtual } = hosts
    const originSiteInfo: timer.site.SiteInfo[] = []
    origin.forEach(host => originSiteInfo.push({ host, type: 'normal' }))
    merged.forEach(host => originSiteInfo.push({ host, type: 'merged' }))
    virtual.forEach(host => originSiteInfo.push({ host, type: 'virtual' }))
    originSiteInfo.forEach(o => {
        const key = calcUniqueKey(o)
        !options[key] && (options[key] = o)
    })
    return Object.values(options)
}

const HOST_PLACEHOLDER = t(msg => msg.analysis.common.hostPlaceholder)

function calcKey(option: timer.site.SiteKey): string {
    const { host, type } = option
    let prefix = '_'
    type === 'merged' && (prefix = 'm')
    type === 'virtual' && (prefix = 'v')
    return `${prefix}${host || ''}`
}

function calcSite(key: string): timer.site.SiteKey {
    if (!key?.length) return undefined
    const prefix = key.charAt(0)
    const host = key.substring(1)
    let type: timer.site.Type = 'normal'
    prefix === 'm' && (type = 'merged')
    prefix === 'v' && (type = 'virtual')
    return { host, type }
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

const AnalysisFilter = defineComponent({
    props: {
        site: Object as PropType<timer.site.SiteKey>,
        timeFormat: String as PropType<timer.app.TimeFormat>
    },
    emits: {
        siteChange: (_site: timer.site.SiteKey) => true,
        timeFormatChange: (_format: timer.app.TimeFormat) => true,
    },
    setup(props, ctx) {
        const defaultSite: timer.site.SiteInfo = props.site
        const [domainKey, setDomainKey] = useState(defaultSite ? calcKey(defaultSite) : '')
        const { data: trendDomainOptions, loading: trendSearching, refresh: searchRemote } = useManualRequest(
            fetchDomain,
            { defaultValue: defaultSite ? [defaultSite] : [] },
        )
        const [timeFormat, setTimeFormat] = useState(props.timeFormat)
        watch(domainKey, () => ctx.emit('siteChange', calcSite(domainKey.value)))
        watch(timeFormat, () => ctx.emit('timeFormatChange', timeFormat.value))

        return () => (
            <Flex gap={10}>
                <ElSelect
                    placeholder={HOST_PLACEHOLDER}
                    modelValue={domainKey.value}
                    filterable
                    remote
                    loading={trendSearching.value}
                    clearable
                    remoteMethod={searchRemote}
                    onChange={setDomainKey}
                    onClear={() => setDomainKey()}
                    style={SELECT_WRAPPER_STYLE}
                >
                    {(trendDomainOptions.value || [])?.map(
                        site => (
                            <ElOption
                                value={calcKey(site)}
                                label={labelOfHostInfo(site)}
                            >
                                <span>{site.host}</span>
                                {site.alias && <ElTag size="small" type="info">{site.alias}</ElTag>}
                                {site.type === 'merged' && <SiteOptionTag text={MERGED_TAG_TXT} />}
                                {site.type === 'virtual' && <SiteOptionTag text={VIRTUAL_TAG_TXT} />}
                            </ElOption>
                        )
                    )}
                </ElSelect>
                <TimeFormatFilterItem
                    defaultValue={timeFormat.value}
                    onChange={setTimeFormat}
                />
            </Flex>
        )
    }
})

export default AnalysisFilter