/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { PropType, Ref } from "vue"

import { t } from "@app/locale"
import statService, { HostSet } from "@service/stat-service"
import { ElFormItem, ElOption, ElSelect, ElTag } from "element-plus"
import { defineComponent, ref } from "vue"
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
    const existedOptions: _OptionInfo[] = []
    const notExistedOptions: _OptionInfo[] = []
    allAlias.forEach(siteKey => {
        const hasAlias = existedAliasSet.has(cvt2OptionValue(siteKey))
        const props: _OptionInfo = { siteKey, hasAlias }
        hasAlias ? existedOptions.push(props) : notExistedOptions.push(props)
    })

    const originalOptions = [...notExistedOptions, ...existedOptions]

    const result: _OptionInfo[] = []
    const existIdx = originalOptions.findIndex(o => o.siteKey?.host === query)
    if (existIdx === -1) {
        // Not exist host, insert site into the first
        result.push({ siteKey: { host: query, virtual: isValidVirtualHost(query) }, hasAlias: false })
        result.push(...originalOptions)
    } else {
        result.push(originalOptions[existIdx])
        originalOptions.forEach((opt, idx) => idx !== existIdx && result.push(opt))
    }

    searchedHosts.value = result
    searching.value = false
}

const renderOption = ({ siteKey, hasAlias }: _OptionInfo) => {
    const { host, merged, virtual } = siteKey
    return <ElOption value={cvt2OptionValue(siteKey)} disabled={hasAlias} label={labelOf(siteKey, hasAlias)}>
        <span>{host}</span>
        {merged && <ElTag size="small">{MERGED_MSG}</ElTag>}
        {virtual && <ElTag size="small">{VIRTUAL_MSG}</ElTag>}
        {hasAlias && <ElTag size="small" type="info">{EXIST_MSG}</ElTag>}
    </ElOption>
}

const _default = defineComponent({
    props: {
        modelValue: Object as PropType<timer.site.SiteKey>
    },
    emits: {
        change: (_siteKey: timer.site.SiteKey) => true
    },
    setup(props, ctx) {
        const searching: Ref<boolean> = ref(false)
        const searchedHosts: Ref<_OptionInfo[]> = ref([])
        return () => <ElFormItem
            prop="key"
            label={t(msg => msg.siteManage.column.host)}
        >
            <ElSelect
                style={{ width: '100%' }}
                modelValue={cvt2OptionValue(props.modelValue)}
                filterable
                remote
                loading={searching.value}
                remoteMethod={(query: string) => handleRemoteSearch(query, searching, searchedHosts)}
                onChange={val => ctx.emit("change", val ? cvt2SiteKey(val) : undefined)}
            >
                {searchedHosts.value?.map(renderOption)}
            </ElSelect>
        </ElFormItem>
    }
})

export default _default
