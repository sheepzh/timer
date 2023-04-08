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
import { t } from "@app/locale"
import SelectFilterItem from "@app/components/common/select-filter-item"
import { labelOfHostInfo } from "../util"

async function handleRemoteSearch(queryStr: string, trendDomainOptions: Ref<timer.site.SiteKey[]>, searching: Ref<boolean>) {
    if (!queryStr) {
        trendDomainOptions.value = []
        return
    }
    searching.value = true
    const domains: HostSet = await statService.listHosts(queryStr)
    const options: timer.site.SiteKey[] = []
    const { origin, merged, virtual } = domains
    origin.forEach(host => options.push({ host }))
    merged.forEach(host => options.push({ host, merged: true }))
    virtual.forEach(host => options.push({ host, virtual: true }))
    trendDomainOptions.value = options
    searching.value = false
}

const HOST_PLACEHOLDER = t(msg => msg.analysis.common.hostPlaceholder)

const TIME_FORMAT_LABELS: { [key in timer.app.TimeFormat]: string } = {
    default: t(msg => msg.timeFormat.default),
    second: t(msg => msg.timeFormat.second),
    minute: t(msg => msg.timeFormat.minute),
    hour: t(msg => msg.timeFormat.hour)
}

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
function renderHostLabel(hostInfo: timer.site.SiteKey): VNode[] {
    const result = [
        h('span', {}, hostInfo.host)
    ]
    hostInfo.merged && result.push(
        h(ElTag, { size: 'small' }, () => MERGED_TAG_TXT)
    )
    hostInfo.virtual && result.push(
        h(ElTag, { size: 'small' }, () => VIRTUAL_TAG_TXT)
    )
    return result
}

const _default = defineComponent({
    name: "TrendFilter",
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
                hostInfo => h(ElOption, {
                    value: keyOfHostInfo(hostInfo),
                    label: labelOfHostInfo(hostInfo),
                }, () => renderHostLabel(hostInfo))
            )),
            h(SelectFilterItem, {
                historyName: 'timeFormat',
                defaultValue: timeFormat.value,
                options: TIME_FORMAT_LABELS,
                onSelect: (newVal: timer.app.TimeFormat) => ctx.emit('timeFormatChange', timeFormat.value = newVal)
            })
        ]
    }
})

export default _default