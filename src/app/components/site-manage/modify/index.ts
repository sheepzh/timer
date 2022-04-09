/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElButton, ElDialog, ElForm, ElMessage } from "element-plus"
import { computed, defineComponent, h, reactive, ref, Ref, SetupContext, UnwrapRef } from "vue"
import { t } from "@app/locale"
import { HostAliasInfo } from "@entity/dto/host-alias-info"
import { Check } from "@element-plus/icons-vue"
import HostAlias from "@entity/dao/host-alias"
import hostAliasDatabase from "@service/host-alias-service"
import SiteManageHostFormItem from "./host-form-item"
import SiteManageNameFormItem from "./name-form-item"

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

function validateForm(formRef: Ref): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        const validate = formRef.value?.validate
        validate
            ? validate((valid: boolean) => valid ? resolve(true) : resolve(false))
            : reject(false)
    })
}

async function handleSave(ctx: SetupContext<_Emit[]>, isNew: boolean, formData: Partial<HostAlias>): Promise<boolean> {
    const host = formData.host
    const name = formData.name?.trim()
    if (isNew && await hostAliasDatabase.exist(host)) {
        ElMessage({
            type: 'warning',
            message: t(msg => msg.siteManage.msg.hostExistWarn, { host }),
            showClose: true,
            duration: 1600
        })
        return false
    }
    await hostAliasDatabase.change(host, name)
    ElMessage.success(t(msg => msg.siteManage.msg.saved))
    ctx.emit("save", isNew, host, name)
    return true
}

type _Emit = "save"

const BTN_ADD_TXT = t(msg => msg.siteManage.button.add)
const BTN_MDF_TXT = t(msg => msg.siteManage.button.modify)

const _default = defineComponent({
    name: "HostAliasModify",
    emits: ['save'],
    setup: (_, context: SetupContext<_Emit[]>) => {
        const isNew: Ref<boolean> = ref(false)
        const visible: Ref<boolean> = ref(false)
        const buttonText = computed(() => isNew ? BTN_ADD_TXT : BTN_MDF_TXT)
        const formData: UnwrapRef<Partial<HostAlias>> = reactive({
            host: undefined,
            alias: undefined
        })
        const formRef: Ref = ref()

        context.expose({
            add() {
                formData.host = undefined
                formData.name = undefined
                visible.value = true
                isNew.value = true
            },
            modify(hostAliasInfo: HostAliasInfo) {
                visible.value = true
                formData.host = hostAliasInfo.host
                formData.name = hostAliasInfo.name
                isNew.value = false
            },
            hide: () => visible.value = false
        })
        return () => h(ElDialog, {
            width: '450px',
            title: buttonText.value,
            modelValue: visible.value,
            closeOnClickModal: false,
            onClose: () => visible.value = false
        }, {
            default: () => h(ElForm, {
                labelPosition: 'right',
                labelWidth: '100px'
            }, () => h(ElForm,
                { model: formData, rules: formRule, ref: formRef },
                () => [
                    // Host form item
                    h(SiteManageHostFormItem, {
                        modelValue: formData.host,
                        editing: isNew.value,
                        onChange: (newVal: string) => formData.host = newVal
                    }),
                    // Name form item
                    h(SiteManageNameFormItem, {
                        modelValue: formData.name,
                        onInput: (newVal: string) => formData.name = newVal
                    })
                ]
            )),
            footer: () => h(ElButton, {
                type: 'primary',
                icon: Check,
                async onClick() {
                    const valid: boolean = await validateForm(formRef)
                    if (!valid) {
                        return false
                    }
                    const saved = await handleSave(context, isNew.value, formData)
                    saved && (visible.value = false)
                }
            }, () => t(msg => msg.siteManage.button.save))
        })
    }
})

export default _default
