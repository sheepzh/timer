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
    setup(_props, ctx) {
        const urlRef: Ref<string> = ref()
        const matchedConditionRef: Ref<string[]> = ref([])
        const visible: Ref<boolean> = ref(false)
        const urlInputtingRef: Ref<boolean> = ref(true)
        const resultTitleRef: ComputedRef<string> = computed(() => computeResultTitle(urlRef.value, urlInputtingRef.value, matchedConditionRef.value))
        const resultTypeRef: ComputedRef<_ResultType> = computed(() => computeResultType(urlRef.value, urlInputtingRef.value, matchedConditionRef.value))
        const resultDescRef: ComputedRef<string[]> = computed(() => computeResultDesc(urlRef.value, urlInputtingRef.value, matchedConditionRef.value))

        const changeInput = (newVal: string) => (urlInputtingRef.value = true) && (urlRef.value = newVal?.trim())
        const test = () => {
            urlInputtingRef.value = false
            handleTest(urlRef.value).then(matched => matchedConditionRef.value = matched)
        }

        const instance: TestInstance = {
            show() {
                urlRef.value = ''
                visible.value = true
                urlInputtingRef.value = true
                matchedConditionRef.value = []
            }
        }
        ctx.expose(instance)

        return () => h(ElDialog, {
            title: t(msg => msg.button.test),
            modelValue: visible.value,
            closeOnClickModal: false,
            onClose: () => visible.value = false
        }, () => [
            h(ElFormItem, {
                label: t(msg => msg.limit.button.test),
                labelWidth: 120
            }, () => h(ElInput, {
                modelValue: urlRef.value,
                clearable: true,
                onClear: () => changeInput(''),
                onKeyup: (event: KeyboardEvent) => event.key === 'Enter' && test(),
                onInput: (newVal: string) => changeInput(newVal)
            }, {
                append: () => h(ElButton, {
                    onClick: () => test()
                }, () => t(msg => msg.button.test)),
            })),
            h(ElAlert, {
                closable: false,
                type: resultTypeRef.value,
                title: resultTitleRef.value,
            }, () => resultDescRef.value.map(desc => h('li', desc)))
        ])
    }
})

export default _default