/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import limitService from "@service/limit-service"
import { ElAlert, AlertProps, ElButton, ElDialog, ElFormItem, ElInput } from "element-plus"
import { defineComponent, Ref, ref, ComputedRef, computed } from "vue"

export type TestInstance = {
    show(): void
}

function computeResultTitle(url: string, inputting: boolean, matched: timer.limit.Rule[]): string {
    if (!url) {
        return t(msg => msg.limit.message.inputTestUrl)
    }
    if (inputting) {
        return t(msg => msg.limit.message.clickTestButton, { buttonText: t(msg => msg.button.test) })
    }
    if (!matched?.length) {
        return t(msg => msg.limit.message.noRuleMatched)
    } else {
        return t(msg => msg.limit.message.rulesMatched)
    }
}

function computeResultDesc(url: string, inputting: boolean, matched: timer.limit.Rule[]): string[] {
    if (!url || inputting || !matched?.length) {
        return []
    }
    return matched.map(m => m.name)
}

type _ResultType = AlertProps['type']

function computeResultType(url: string, inputting: boolean, matched: timer.limit.Rule[]): _ResultType {
    if (!url || inputting) {
        return 'info'
    }
    return matched?.length ? 'success' : 'warning'
}

const _default = defineComponent({
    setup: (_props, ctx) => {
        const url: Ref<string> = ref()
        const matched: Ref<timer.limit.Rule[]> = ref([])
        const visible: Ref<boolean> = ref(false)
        const urlInputting: Ref<boolean> = ref(true)
        const resultTitle: ComputedRef<string> = computed(() => computeResultTitle(url.value, urlInputting.value, matched.value))
        const resultType: ComputedRef<_ResultType> = computed(() => computeResultType(url.value, urlInputting.value, matched.value))
        const resultDesc: ComputedRef<string[]> = computed(() => computeResultDesc(url.value, urlInputting.value, matched.value))

        const changeInput = (newVal: string) => (urlInputting.value = true) && (url.value = newVal?.trim())
        const handleTest = async () => {
            urlInputting.value = false
            matched.value = await limitService.select({ url: url.value, filterDisabled: true })
        }

        const instance: TestInstance = {
            show() {
                url.value = ''
                visible.value = true
                urlInputting.value = true
                matched.value = []
            }
        }
        ctx.expose(instance)
        return () => (
            <ElDialog
                title={t(msg => msg.button.test)}
                modelValue={visible.value}
                closeOnClickModal={false}
                onClose={() => visible.value = false}
            >
                <ElFormItem labelWidth={120} label={t(msg => msg.limit.button.test)}>
                    <ElInput
                        modelValue={url.value}
                        clearable
                        onClear={() => changeInput('')}
                        onKeydown={ev => (ev as KeyboardEvent).key === "Enter" && handleTest()}
                        onInput={changeInput}
                        v-slots={{
                            append: () => <ElButton onClick={handleTest}>{t(msg => msg.button.test)}</ElButton>
                        }}
                    />
                </ElFormItem>
                <ElAlert closable={false} type={resultType.value} title={resultTitle.value}>
                    {resultDesc.value.map(desc => <li>{desc}</li>)}
                </ElAlert>
            </ElDialog>
        )
    }
})

export default _default