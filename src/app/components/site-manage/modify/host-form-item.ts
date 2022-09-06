/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { PropType, Ref } from "vue"

import { t } from "@app/locale"
import HostAliasDatabase from "@db/host-alias-database"
import timerService, { HostSet } from "@service/timer-service"
import { ElFormItem, ElInput, ElOption, ElSelect } from "element-plus"
import { defineComponent, h, ref } from "vue"
import { aliasKeyOf, labelOf, optionValueOf } from "../common"

const hostAliasDatabase = new HostAliasDatabase(chrome.storage.local)

type _OptionInfo = {
    aliasKey: timer.site.AliasKey
    hasAlias: boolean
}

async function handleRemoteSearch(query: string, searching: Ref<boolean>, searchedHosts: Ref<_OptionInfo[]>) {
    if (!query) {
        return
    }
    searching.value = true
    const hostSet: HostSet = (await timerService.listHosts(query))
    const allAlias: timer.site.AliasKey[] =
        [
            ...Array.from(hostSet.origin || []).map(host => ({ host, merged: false })),
            ...Array.from(hostSet.merged || []).map(host => ({ host, merged: true })),
        ]
    const existedAliasSet = new Set()
    const existedKeys: timer.site.AliasKey[] = (await hostAliasDatabase.existBatch(allAlias))
    existedKeys.forEach(key => existedAliasSet.add(optionValueOf(key)))
    const existedOptions = []
    const notExistedOptions = []
    allAlias.forEach(aliasKey => {
        const hasAlias = existedAliasSet.has(optionValueOf(aliasKey))
        const props: _OptionInfo = { aliasKey, hasAlias }
        hasAlias ? existedOptions.push(props) : notExistedOptions.push(props)
    })
    // Not exist first
    searchedHosts.value = [...notExistedOptions, ...existedOptions]
    searching.value = false
}

function renderOption({ aliasKey, hasAlias }: _OptionInfo) {
    let label = labelOf(aliasKey, hasAlias)
    return h(ElOption, { value: optionValueOf(aliasKey), disabled: hasAlias, label })
}

const HOST_LABEL = t(msg => msg.siteManage.column.host)
const _default = defineComponent({
    name: "SiteManageHostFormItem",
    props: {
        editing: Boolean,
        modelValue: Object as PropType<timer.site.AliasKey>
    },
    emits: ["change"],
    setup(props, ctx) {
        const searching: Ref<boolean> = ref(false)
        const searchedHosts: Ref<_OptionInfo[]> = ref([])
        return () => h(ElFormItem, { prop: 'host', label: HOST_LABEL },
            () => props.editing ?
                h(ElSelect, {
                    style: { width: '100%' },
                    modelValue: optionValueOf(props.modelValue),
                    filterable: true,
                    remote: true,
                    loading: searching.value,
                    remoteMethod: (query: string) => handleRemoteSearch(query, searching, searchedHosts),
                    onChange: (newVal: string) => ctx.emit("change", newVal ? aliasKeyOf(newVal) : undefined)
                }, () => searchedHosts.value?.map(renderOption))
                : h(ElInput, {
                    disabled: true,
                    modelValue: labelOf(props.modelValue)
                })
        )
    }
})

export default _default
