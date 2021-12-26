/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElOption, ElSelect } from "element-plus"
import { defineComponent, h, reactive, ref, Ref, SetupContext, UnwrapRef } from "vue"
import { t } from "@app/locale"
import { HostAliasInfo } from "@entity/dto/host-alias-info"
import { Check } from "@element-plus/icons"
import HostAlias from "@entity/dao/host-alias"
import hostAliasDatabase from "@service/host-alias-service"
import timerService from "@service/timer-service"

const dialogVisibleRef: Ref<boolean> = ref(false)
const isNewRef: Ref<boolean> = ref(false)
const hostSearchingRef: Ref<boolean> = ref(false)
type _HostOptionProp = {
    host: string
    hasAlias: boolean
}
const searchedHostsRef: Ref<_HostOptionProp[]> = ref([])

const formDataRef: UnwrapRef<Partial<HostAlias>> = reactive({
    host: undefined,
    alias: undefined
})
const formRule = {
    name: [
        {
            required: true,
            message: t(msg => msg.siteManage.form.emptyAlias),
            trigger: 'blur',
        }
    ],
    host: [
        {
            required: true,
            message: t(msg => msg.siteManage.form.emptyHost),
            trigger: 'blur'
        }
    ]
}
const formRef: Ref = ref()
function validateForm(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        const validate = formRef.value?.validate
        validate
            ? validate((valid: boolean) => valid ? resolve(true) : resolve(false))
            : reject(false)
    })
}
async function handleSave(ctx: { $emit: (arg0: string, ...args: any[]) => void }) {
    const valid: boolean = await validateForm()
    if (!valid) {
        return
    }
    const isNew = isNewRef.value
    const host = formDataRef.host
    const name = formDataRef.name.trim()
    if (isNew && await hostAliasDatabase.exist(host)) {
        ElMessage({
            type: 'warning',
            message: t(msg => msg.siteManage.msg.hostExistWarn, { host }),
            showClose: true,
            duration: 1600
        })
        return
    }
    await hostAliasDatabase.change(host, name)
    ElMessage.success(t(msg => msg.siteManage.msg.saved))
    ctx.$emit('saved', isNew, host, name)
    dialogVisibleRef.value = false
}

const methods = {
    add: () => {
        formDataRef.host = undefined
        formDataRef.name = undefined
        dialogVisibleRef.value = true
        isNewRef.value = true
    },
    modify: (hostAliasInfo: HostAliasInfo) => {
        dialogVisibleRef.value = true
        formDataRef.host = hostAliasInfo.host
        formDataRef.name = hostAliasInfo.name
        isNewRef.value = false
    },
    hide: () => dialogVisibleRef.value = false
}

/**
 * Search the host can be added
 * @param query 
 */
async function handleRemoteSearchHost(query: string): Promise<void> {
    if (!query) {
        return
    }
    hostSearchingRef.value = true
    const hostSet: Set<string> = (await timerService.listHosts(query)).origin
    const allHost: string[] = Array.from(hostSet)
    const existedInfo: { [host: string]: boolean } = await hostAliasDatabase.existBatch(allHost)
    const existedOptions = []
    const notExistedOptions = []
    allHost.forEach(host => {
        const hasAlias = !!existedInfo[host]
        const props: _HostOptionProp = { host, hasAlias }
        hasAlias ? existedOptions.push(props) : notExistedOptions.push(props)
    })
    // Not exist first
    searchedHostsRef.value = [...notExistedOptions, ...existedOptions]
    hostSearchingRef.value = false
}
const EXIST_MSG = t(msg => msg.siteManage.msg.existedTag)
const renderHostSelectOption = ({ host, hasAlias }: _HostOptionProp) => {
    let label = host
    hasAlias && (label += `[${EXIST_MSG}]`)
    return h(ElOption, { value: host, disabled: hasAlias, label })
}
const renderHostSelect = () => h(ElSelect,
    {
        style: {
            width: '100%'
        },
        modelValue: formDataRef.host,
        filterable: true,
        remote: true,
        loading: hostSearchingRef.value,
        remoteMethod: (query: string) => handleRemoteSearchHost(query),
        onChange: (newVal: string) => formDataRef.host = newVal
    }, () => searchedHostsRef.value?.map(renderHostSelectOption)
)

const renderHost = () => h(ElFormItem,
    { prop: 'host', label: t(msg => msg.siteManage.column.host) },
    () => isNewRef.value ? renderHostSelect() : h(ElInput, { disabled: true, modelValue: formDataRef.host })
)
const renderName = () => h(ElFormItem,
    { prop: 'name', label: t(msg => msg.siteManage.column.alias) },
    () => h(ElInput, {
        modelValue: formDataRef.name,
        onInput: (newVal: string) => formDataRef.name = newVal.trimStart()
    })
)

const renderForm = () => h(ElForm,
    { model: formDataRef, rules: formRule, ref: formRef },
    () => [renderHost(), renderName()]
)

const render = (ctx: any) => h(ElDialog, {
    width: '450px',
    title: t(msg => isNewRef.value ? msg.siteManage.button.add : msg.siteManage.button.modify),
    modelValue: dialogVisibleRef.value,
    closeOnClickModal: false,
    onClose: () => dialogVisibleRef.value = false
}, {
    default: () => h(ElForm, {
        labelPosition: 'right',
        labelWidth: '100px'
    }, renderForm),
    footer: () => h(ElButton,
        { type: 'primary', icon: Check, onClick: () => handleSave(ctx) },
        () => t(msg => msg.siteManage.button.save)
    )
})

const _default = defineComponent({
    emits: ['saved'],
    setup: (_, context: SetupContext) => {
        context.expose(methods)
    },
    render
})

export default _default
