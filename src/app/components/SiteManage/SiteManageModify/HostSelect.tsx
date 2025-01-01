/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { useManualRequest } from "@hooks"
import siteService from "@service/site-service"
import statService, { type HostSet } from "@service/stat-service"
import { MERGED_HOST, ALL_HOSTS as REMAIN_HOSTS } from "@util/constant/remain-host"
import { isValidVirtualHost, judgeVirtualFast } from "@util/pattern"
import { ElOption, ElSelect, ElTag } from "element-plus"
import { defineComponent, type PropType } from "vue"
import { cvt2OptionValue, cvt2SiteKey, EXIST_MSG, labelOf, MERGED_MSG, VIRTUAL_MSG } from "../common"

type _OptionInfo = {
    siteKey: timer.site.SiteKey
    hasAlias: boolean
}

function cleanQuery(query: string) {
    try {
        const url = new URL(query)
        const { host, pathname } = url
        query = host + pathname
    } catch {
    }
    if (query.endsWith('/')) query += '**'
    return query
}

async function handleRemoteSearch(query: string): Promise<_OptionInfo[]> {
    query = cleanQuery(query)
    if (!query) return []
    const hostSet: HostSet = (await statService.listHosts(query))
    const allAlias: timer.site.SiteKey[] = [
        ...Array.from(hostSet.origin || []).map(host => ({ host, merged: false })),
        ...Array.from(hostSet.merged || []).map(host => ({ host, merged: true })),
    ]
    // Add local files
    REMAIN_HOSTS.forEach(remain => allAlias.push({ host: remain, merged: false }))
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
        const isVirtual = judgeVirtualFast(query)
        if (isVirtual) {
            isValidVirtualHost(query) && result.push({ siteKey: { host: query, virtual: true }, hasAlias: false })
        } else {
            result.push({ siteKey: { host: query, virtual: false }, hasAlias: false })
        }
        result.push(...originalOptions)
    } else {
        result.push(originalOptions[existIdx])
        originalOptions.forEach((opt, idx) => idx !== existIdx && result.push(opt))
    }
    return result
}

const renderOption = ({ siteKey, hasAlias }: _OptionInfo) => {
    const { host, merged, virtual } = siteKey
    return <ElOption value={cvt2OptionValue(siteKey)} disabled={hasAlias} label={labelOf(siteKey, hasAlias)}>
        <span>{host}</span>
        <ElTag v-show={merged} size="small">{MERGED_MSG}</ElTag>
        <ElTag v-show={virtual} size="small">{VIRTUAL_MSG}</ElTag>
        <ElTag v-show={hasAlias} size="small" type="info">{EXIST_MSG}</ElTag>
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
        const { data: options, loading: searching, refresh: searchOption } = useManualRequest(handleRemoteSearch)
        return () => (
            <ElSelect
                style={{ width: '100%' }}
                modelValue={cvt2OptionValue(props.modelValue)}
                filterable
                remote
                loading={searching.value}
                remoteMethod={searchOption}
                onChange={val => ctx.emit("change", val ? cvt2SiteKey(val) : undefined)}
            >
                {options.value?.map(renderOption)}
            </ElSelect>
        )
    }
})

export default _default
