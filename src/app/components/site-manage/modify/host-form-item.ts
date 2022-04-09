/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import HostAliasDatabase from "@db/host-alias-database"
import timerService from "@service/timer-service"
import { ElFormItem, ElInput, ElOption, ElSelect } from "element-plus"
import { defineComponent, h, ref, Ref } from "vue"

const hostAliasDatabase = new HostAliasDatabase(chrome.storage.local)

type _OptionInfo = {
    host: string
    hasAlias: boolean
}

async function handleRemoteSearch(query: string, searching: Ref<boolean>, searchedHosts: Ref<_OptionInfo[]>) {
    if (!query) {
        return
    }
    searching.value = true
    const hostSet: Set<string> = (await timerService.listHosts(query)).origin
    const allHost: string[] = Array.from(hostSet)
    const existedInfo: { [host: string]: boolean } = await hostAliasDatabase.existBatch(allHost)
    const existedOptions = []
    const notExistedOptions = []
    allHost.forEach(host => {
        const hasAlias = !!existedInfo[host]
        const props: _OptionInfo = { host, hasAlias }
        hasAlias ? existedOptions.push(props) : notExistedOptions.push(props)
    })
    // Not exist first
    searchedHosts.value = [...notExistedOptions, ...existedOptions]
    searching.value = false
}

const EXIST_MSG = t(msg => msg.siteManage.msg.existedTag)
function renderOption({ host, hasAlias }: _OptionInfo) {
    let label = host
    hasAlias && (label += `[${EXIST_MSG}]`)
    return h(ElOption, { value: host, disabled: hasAlias, label })
}

const HOST_LABEL = t(msg => msg.siteManage.column.host)
const _default = defineComponent({
    name: "SiteManageHostFormItem",
    props: {
        editing: Boolean,
        modelValue: String
    },
    emits: ["change"],
    setup(props, ctx) {
        const searching: Ref<boolean> = ref(false)
        const searchedHosts: Ref<_OptionInfo[]> = ref([])
        return () => h(ElFormItem, { prop: 'host', label: HOST_LABEL },
            () => props.editing ?
                h(ElSelect, {
                    style: { width: '100%' },
                    modelValue: props.modelValue,
                    filterable: true,
                    remote: true,
                    loading: searching.value,
                    remoteMethod: (query: string) => handleRemoteSearch(query, searching, searchedHosts),
                    onChange: (newVal: string) => ctx.emit("change", newVal)
                }, () => searchedHosts.value?.map(renderOption))
                : h(ElInput, { disabled: true, modelValue: props.modelValue })
        )
    }
})

export default _default
