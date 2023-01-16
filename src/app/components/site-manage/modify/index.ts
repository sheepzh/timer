/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref, SetupContext, UnwrapRef } from "vue"

import { ElButton, ElDialog, ElForm, ElMessage } from "element-plus"
import { computed, defineComponent, h, reactive, ref } from "vue"
import { t } from "@app/locale"
import { Check } from "@element-plus/icons-vue"
import hostAliasDatabase from "@service/host-alias-service"
import SiteManageHostFormItem from "./host-form-item"
import SiteManageNameFormItem from "./name-form-item"

declare type _FormData = {
    /**
     * Value of alias key
     */
    key: timer.site.AliasKey
    name: string
}

const formRule = {
    name: [
        {
            required: true,
            message: t(msg => msg.siteManage.form.emptyAlias),
            trigger: 'blur',
        }
    ],
    key: [
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

async function handleSave(ctx: SetupContext<_Emit>, isNew: boolean, formData: _FormData): Promise<boolean> {
    const aliasKey = formData.key
    const name = formData.name?.trim()
    if (isNew && await hostAliasDatabase.exist(aliasKey)) {
        ElMessage({
            type: 'warning',
            message: t(msg => msg.siteManage.msg.hostExistWarn, { host: aliasKey.host }),
            showClose: true,
            duration: 1600
        })
        return false
    }
    await hostAliasDatabase.change(aliasKey, name)
    ElMessage.success(t(msg => msg.siteManage.msg.saved))
    ctx.emit("save", isNew, aliasKey, name)
    return true
}

type _Emit = {
    save: (isNew: boolean, aliasKey: timer.site.AliasKey, name: string) => void
}

const BTN_ADD_TXT = t(msg => msg.siteManage.button.add)
const BTN_MDF_TXT = t(msg => msg.siteManage.button.modify)

const _default = defineComponent({
    name: "HostAliasModify",
    emits: {
        save: () => true
    },
    setup: (_, context: SetupContext<_Emit>) => {
        const isNew: Ref<boolean> = ref(false)
        const visible: Ref<boolean> = ref(false)
        const buttonText = computed(() => isNew ? BTN_ADD_TXT : BTN_MDF_TXT)
        const formData: UnwrapRef<_FormData> = reactive({
            key: undefined,
            name: undefined
        })
        const formRef: Ref = ref()

        context.expose({
            add() {
                formData.key = undefined
                formData.name = undefined
                visible.value = true
                isNew.value = true
            },
            modify(hostAliasInfo: timer.site.AliasIcon) {
                visible.value = true
                formData.key = hostAliasInfo
                formData.name = hostAliasInfo.name
                isNew.value = false
            },
            hide: () => visible.value = false
        })
        const save = async () => {
            const valid: boolean = await validateForm(formRef)
            if (!valid) {
                return false
            }
            const saved = await handleSave(context, isNew.value, formData)
            saved && (visible.value = false)
        }
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
                        modelValue: formData.key,
                        editing: isNew.value,
                        onChange: (newKey: timer.site.AliasKey) => formData.key = newKey
                    }),
                    // Name form item
                    h(SiteManageNameFormItem, {
                        modelValue: formData.name,
                        onInput: (newVal: string) => formData.name = newVal,
                        onEnter: save
                    })
                ]
            )),
            footer: () => h(ElButton, {
                type: 'primary',
                icon: Check,
                onClick: save
            }, () => t(msg => msg.siteManage.button.save))
        })
    }
})

export default _default
