/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { PropType, Ref, VNode } from "vue"

import { t } from "@app/locale"
import statService, { HostSet } from "@service/stat-service"
import { ElFormItem, ElOption, ElSelect, ElTag } from "element-plus"
import { defineComponent, h, ref } from "vue"
import { cvt2SiteKey, cvt2OptionValue, EXIST_MSG, MERGED_MSG, VIRTUAL_MSG, labelOf } from "../common"
import { ALL_HOSTS, MERGED_HOST } from "@util/constant/remain-host"
import siteService from "@service/site-service"
import { isValidVirtualHost } from "@util/pattern"

type _OptionInfo = {
    siteKey: timer.site.SiteKey
    hasAlias: boolean
}

async function handleRemoteSearch(query: string, searching: Ref<boolean>, searchedHosts: Ref<_OptionInfo[]>) {
    if (!query) {
        return
    }
    searching.value = true
    const hostSet: HostSet = (await statService.listHosts(query))
    const allAlias: timer.site.SiteKey[] =
        [
            ...Array.from(hostSet.origin || []).map(host => ({ host, merged: false })),
            ...Array.from(hostSet.merged || []).map(host => ({ host, merged: true })),
        ]
    // Add local files
    ALL_HOSTS.forEach(remain => allAlias.push({ host: remain, merged: false }))
    allAlias.push({ host: MERGED_HOST, merged: true })
    const existedAliasSet = new Set()
    const existedKeys = await siteService.existBatch(allAlias)
    existedKeys.forEach(key => existedAliasSet.add(cvt2OptionValue(key)))
    const existedOptions = []
    const notExistedOptions = []
    allAlias.forEach(siteKey => {
        const hasAlias = existedAliasSet.has(cvt2OptionValue(siteKey))
        const props: _OptionInfo = { siteKey, hasAlias }
        hasAlias ? existedOptions.push(props) : notExistedOptions.push(props)
    })

    const originalOptions = [...notExistedOptions, ...existedOptions]

    const result = []
    // Not exist host, insert virtual site into the first
    const existsHost = originalOptions.find(o => o.siteKey?.host === query)
    !existsHost && isValidVirtualHost(query) && result.push({ siteKey: { host: query, virtual: true }, hasAlias: false })
    result.push(...originalOptions)

    searchedHosts.value = result
    searching.value = false
}

function renderOptionSlots(siteKey: timer.site.SiteKey, hasAlias: boolean): VNode[] {
    const { host, merged, virtual } = siteKey
    const result = [
        h('span', {}, host)
    ]
    merged && result.push(h(ElTag, { size: 'small' }, () => MERGED_MSG))
    virtual && result.push(h(ElTag, { size: 'small' }, () => VIRTUAL_MSG))
    hasAlias && result.push(h(ElTag, { size: 'small', type: 'info' }, () => EXIST_MSG))
    return result
}

function renderOption({ siteKey, hasAlias }: _OptionInfo) {
    return h(ElOption, {
        value: cvt2OptionValue(siteKey),
        disabled: hasAlias,
        label: labelOf(siteKey, hasAlias)
    }, () => renderOptionSlots(siteKey, hasAlias))
}

const HOST_LABEL = t(msg => msg.siteManage.column.host)
const _default = defineComponent({
    name: "SiteManageHostFormItem",
    props: {
        modelValue: Object as PropType<timer.site.SiteKey>
    },
    emits: {
        change: (_siteKey: timer.site.SiteKey) => true
    },
    setup(props, ctx) {
        const searching: Ref<boolean> = ref(false)
        const searchedHosts: Ref<_OptionInfo[]> = ref([])
        return () => h(ElFormItem, { prop: 'key', label: HOST_LABEL },
            () => h(ElSelect, {
                style: { width: '100%' },
                modelValue: cvt2OptionValue(props.modelValue),
                filterable: true,
                remote: true,
                loading: searching.value,
                remoteMethod: (query: string) => handleRemoteSearch(query, searching, searchedHosts),
                onChange: (newVal: string) => ctx.emit("change", newVal ? cvt2SiteKey(newVal) : undefined)
            }, () => searchedHosts.value?.map(renderOption))
        )
    }
})

export default _default
