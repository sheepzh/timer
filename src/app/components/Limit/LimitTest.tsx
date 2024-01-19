/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import limitService from "@service/limit-service"
import { ElAlert, AlertProps, ElButton, ElDialog, ElFormItem, ElInput } from "element-plus"
import { defineComponent, Ref, ref, h, ComputedRef, computed } from "vue"

export type TestInstance = {
    show(): void
}

async function handleTest(url: string): Promise<string[]> {
    const items = await limitService.select({ url, filterDisabled: true })
    return items.map(v => v.cond)
}

function computeResultTitle(url: string, inputting: boolean, matchedCondition: string[]): string {
    if (!url) {
        return t(msg => msg.limit.message.inputTestUrl)
    }
    if (inputting) {
        return t(msg => msg.limit.message.clickTestButton, { buttonText: t(msg => msg.button.test) })
    }
    if (!matchedCondition?.length) {
        return t(msg => msg.limit.message.noRuleMatched)
    } else {
        return t(msg => msg.limit.message.rulesMatched)
    }
}

function computeResultDesc(url: string, inputting: boolean, matchedCondition: string[]): string[] {
    if (!url || inputting || !matchedCondition?.length) {
        return []
    }
    return matchedCondition
}

type _ResultType = AlertProps['type']

function computeResultType(url: string, inputting: boolean, matchedCondition: string[]): _ResultType {
    if (!url || inputting) {
        return 'info'
    }
    return matchedCondition?.length ? 'success' : 'warning'
}

const _default = defineComponent({
    setup: (_props, ctx) => {
        const url: Ref<string> = ref()
        const matchedCondition: Ref<string[]> = ref([])
        const visible: Ref<boolean> = ref(false)
        const urlInputting: Ref<boolean> = ref(true)
        const resultTitle: ComputedRef<string> = computed(() => computeResultTitle(url.value, urlInputting.value, matchedCondition.value))
        const resultType: ComputedRef<_ResultType> = computed(() => computeResultType(url.value, urlInputting.value, matchedCondition.value))
        const resultDesc: ComputedRef<string[]> = computed(() => computeResultDesc(url.value, urlInputting.value, matchedCondition.value))

        const changeInput = (newVal: string) => (urlInputting.value = true) && (url.value = newVal?.trim())
        const test = () => {
            urlInputting.value = false
            handleTest(url.value).then(matched => matchedCondition.value = matched)
        }

        const instance: TestInstance = {
            show() {
                url.value = ''
                visible.value = true
                urlInputting.value = true
                matchedCondition.value = []
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
                        onKeydown={ev => (ev as KeyboardEvent).key === "Enter" && test()}
                        onInput={changeInput}
                        v-slots={{
                            append: () => <ElButton onClick={test}>{t(msg => msg.button.test)}</ElButton>
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