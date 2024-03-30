/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref, UnwrapRef } from "vue"

import { ElButton, ElDialog, ElForm, FormInstance, ElMessage } from "element-plus"
import { defineComponent, reactive, ref } from "vue"
import { t } from "@app/locale"
import { Check } from "@element-plus/icons-vue"
import siteService from "@service/site-service"
import SiteManageHostFormItem from "./SiteManageHostFormItem"
import SiteManageAliasFormItem from "./SiteManageAliasFormItem"

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

function initData(): _FormData {
    return {
        key: undefined,
        alias: undefined,
    }
}

const _default = defineComponent({
    emits: {
        save: (_siteKey: timer.site.SiteKey, _name: string) => true
    },
    setup: (_, ctx) => {
        const visible: Ref<boolean> = ref(false)
        const formData: UnwrapRef<_FormData> = reactive(initData())
        const form: Ref<FormInstance> = ref()

        const instance: ModifyInstance = {
            add: () => {
                formData.key = undefined
                formData.alias = undefined
                visible.value = true
            },
        }

        ctx.expose(instance)

        const save = async () => {
            const valid: boolean = await validateForm(form)
            if (!valid) return false

            const siteKey = formData.key
            const alias = formData.alias?.trim()
            const siteInfo: timer.site.SiteInfo = { ...siteKey, alias }
            const saved = await handleAdd(siteInfo)
            if (saved) {
                visible.value = false
                ElMessage.success(t(msg => msg.siteManage.msg.saved))
                ctx.emit("save", siteKey, alias)
            }
        }

        return () => <ElDialog
            width={450}
            title={t(msg => msg.button.create)}
            modelValue={visible.value}
            closeOnClickModal={false}
            onClose={() => visible.value = false}
            v-slots={{
                default: () => <ElForm model={formData} rules={formRule} ref={form}>
                    <SiteManageHostFormItem modelValue={formData.key} onChange={val => formData.key = val} />
                    <SiteManageAliasFormItem modelValue={formData.alias} onInput={val => formData.alias = val} onEnter={save} />
                </ElForm>,
                footer: () => <ElButton type="primary" icon={<Check />} onClick={save}>
                    {t(msg => msg.button.save)}
                </ElButton>,
            }}
        />

    }
})

export default _default
