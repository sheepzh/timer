/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref, SetupContext, UnwrapRef } from "vue"

import { ElButton, ElDialog, ElForm, FormInstance, ElMessage } from "element-plus"
import { defineComponent, h, reactive, ref } from "vue"
import { t } from "@app/locale"
import { Check } from "@element-plus/icons-vue"
import siteService from "@service/site-service"
import SiteManageHostFormItem from "./host-form-item"
import SiteManageAliasFormItem from "./alias-form-item"

export type ModifyInstance = {
    add(): void
}

type _FormData = {
    /**
     * Value of alias key
     */
    key: timer.site.SiteKey
    alias: string
}

const formRule = {
    alias: [
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

function validateForm(form: Ref<FormInstance>): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        const validate = form.value?.validate
        validate
            ? validate((valid: boolean) => valid ? resolve(true) : resolve(false))
            : reject(false)
    })
}

async function handleAdd(siteInfo: timer.site.SiteInfo): Promise<boolean> {
    const existed = await siteService.exist(siteInfo)
    if (existed) {
        ElMessage({
            type: 'warning',
            message: t(msg => msg.siteManage.msg.hostExistWarn, { host: siteInfo.host }),
            showClose: true,
            duration: 1600
        })
    } else {
        await siteService.add(siteInfo)
    }
    return !existed
}

async function handleSave(ctx: SetupContext<_Emit>, formData: _FormData): Promise<boolean> {
    const siteKey = formData.key
    const alias = formData.alias?.trim()
    const siteInfo: timer.site.SiteInfo = { ...siteKey, alias }
    const success = await handleAdd(siteInfo)
    if (success) {
        ElMessage.success(t(msg => msg.siteManage.msg.saved))
        ctx.emit("save", siteKey, alias)
    }
    return success
}

type _Emit = {
    save: (siteKey: timer.site.SiteKey, name: string) => void
}

const BTN_ADD_TXT = t(msg => msg.siteManage.button.add)

function initData(): _FormData {
    return {
        key: undefined,
        alias: undefined,
    }
}

const _default = defineComponent({
    name: "HostAliasModify",
    emits: {
        save: (_siteKey: timer.site.SiteKey, _name: string) => true
    },
    setup: (_, ctx: SetupContext<_Emit>) => {
        const visible: Ref<boolean> = ref(false)
        const formData: UnwrapRef<_FormData> = reactive(initData())
        const form: Ref<FormInstance> = ref()

        const instance: ModifyInstance = {
            add() {
                formData.key = undefined
                formData.alias = undefined
                visible.value = true
            },
        }

        ctx.expose(instance)

        const save = async () => {
            const valid: boolean = await validateForm(form)
            if (!valid) {
                return false
            }
            const saved = await handleSave(ctx, formData)
            saved && (visible.value = false)
        }
        return () => h(ElDialog, {
            width: '450px',
            title: BTN_ADD_TXT,
            modelValue: visible.value,
            closeOnClickModal: false,
            onClose: () => visible.value = false
        }, {
            default: () => h(ElForm, {
                labelPosition: 'right',
                labelWidth: '100px'
            }, () => h(ElForm,
                { model: formData, rules: formRule, ref: form },
                () => [
                    // Host form item
                    h(SiteManageHostFormItem, {
                        modelValue: formData.key,
                        onChange: (newKey: timer.site.SiteKey) => formData.key = newKey
                    }),
                    // Name form item
                    h(SiteManageAliasFormItem, {
                        modelValue: formData.alias,
                        onInput: (newVal: string) => formData.alias = newVal,
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
