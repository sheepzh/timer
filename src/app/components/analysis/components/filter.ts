/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref, PropType, VNode } from "vue"

import { ElOption, ElSelect, ElTag } from "element-plus"
import { ref, h, defineComponent } from "vue"
import statService, { HostSet } from "@service/stat-service"
import siteService from "@service/site-service"
import { t } from "@app/locale"
import TimeFormatFilterItem from "@app/components/common/time-format-filter-item"
import { labelOfHostInfo } from "../util"

const calcUniqueKey = ({ host, virtual, merged }: timer.site.SiteInfo) => `${host}${virtual ? 1 : 0}${merged ? 1 : 0}`

async function handleRemoteSearch(queryStr: string, trendDomainOptions: Ref<timer.site.SiteInfo[]>, searching: Ref<boolean>) {
    if (!queryStr) {
        trendDomainOptions.value = []
        return
    }
    searching.value = true

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
    trendDomainOptions.value = Object.values(options)
    searching.value = false
}

const HOST_PLACEHOLDER = t(msg => msg.analysis.common.hostPlaceholder)

function keyOfHostInfo(option: timer.site.SiteKey): string {
    const { merged, virtual, host } = option
    let prefix = '_'
    merged && (prefix = 'm')
    virtual && (prefix = 'v')
    return `${prefix}${host || ''}`
}

function hostInfoOfKey(key: string): timer.site.SiteKey {
    if (!key?.length) return undefined
    const prefix = key.charAt(0)
    return { host: key.substring(1), merged: prefix === 'm', virtual: prefix === 'v' }
}

const MERGED_TAG_TXT = t(msg => msg.analysis.common.merged)
const VIRTUAL_TAG_TXT = t(msg => msg.analysis.common.virtual)

const renderOptionTag = (tagLabel: string) => h('span',
    { style: { float: "right", height: "34px" } },
    h(ElTag, { size: 'small' }, () => tagLabel)
)

function renderHostLabel({ host, merged, virtual, alias }: timer.site.SiteInfo): VNode[] {
    const result = [
        h('span', {}, host)
    ]
    alias && result.push(
        h(ElTag, { size: 'small', type: 'info' }, () => alias)
    )
    merged && result.push(renderOptionTag(MERGED_TAG_TXT))
    virtual && result.push(renderOptionTag(VIRTUAL_TAG_TXT))
    return result
}

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
        const domainKey: Ref<string> = ref('')
        const trendSearching: Ref<boolean> = ref(false)
        const trendDomainOptions: Ref<timer.site.SiteKey[]> = ref([])
        const defaultSite: timer.site.SiteKey = props.site
        const timeFormat: Ref<timer.app.TimeFormat> = ref(props.timeFormat)
        if (defaultSite) {
            domainKey.value = keyOfHostInfo(defaultSite)
            trendDomainOptions.value.push(defaultSite)
        }

        function handleSiteChange() {
            const siteInfo: timer.site.SiteInfo = hostInfoOfKey(domainKey.value)
            ctx.emit('siteChange', siteInfo)
        }

        return () => [
            h(ElSelect, {
                placeholder: HOST_PLACEHOLDER,
                class: 'filter-item',
                modelValue: domainKey.value,
                filterable: true,
                remote: true,
                loading: trendSearching.value,
                clearable: true,
                remoteMethod: (query: string) => handleRemoteSearch(query, trendDomainOptions, trendSearching),
                onChange: (key: string) => {
                    domainKey.value = key
                    handleSiteChange()
                },
                onClear: () => {
                    domainKey.value = undefined
                    handleSiteChange()
                }
            }, () => (trendDomainOptions.value || [])?.map(
                siteInfo => h(ElOption, {
                    value: keyOfHostInfo(siteInfo),
                    label: labelOfHostInfo(siteInfo),
                }, () => renderHostLabel(siteInfo))
            )),
            h(TimeFormatFilterItem, {
                defaultValue: timeFormat.value,
                onSelect: (newVal: timer.app.TimeFormat) => ctx.emit('timeFormatChange', timeFormat.value = newVal)
            })
        ]
    }
})

export default _default