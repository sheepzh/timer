/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { useState, useSwitch } from "@hooks"
import limitService from "@service/limit-service"
import { AlertProps, ElAlert, ElButton, ElDialog, ElFormItem, ElInput } from "element-plus"
import { computed, defineComponent } from "vue"

export type TestInstance = {
    show(): void
}

function computeResultTitle(url: string | undefined, inputting: boolean, matched: timer.limit.Rule[]): string {
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

function computeResultDesc(url: string | undefined, inputting: boolean, matched: timer.limit.Rule[]): string[] {
    if (!url || inputting || !matched?.length) {
        return []
    }
    return matched.map(m => m.name)
}

type _ResultType = AlertProps['type']

function computeResultType(url: string | undefined, inputting: boolean, matched: timer.limit.Rule[]): _ResultType {
    if (!url || inputting) {
        return 'info'
    }
    return matched?.length ? 'success' : 'warning'
}

const _default = defineComponent((_props, ctx) => {
    const [url, , clearUrl] = useState<string>()
    const [matched, , clearMatched] = useState<timer.limit.Rule[]>([])
    const [visible, open, close] = useSwitch()
    const [urlInputting, startInput, endInput] = useSwitch(true)
    const resultTitle = computed(() => computeResultTitle(url.value, urlInputting.value, matched.value))
    const resultType = computed(() => computeResultType(url.value, urlInputting.value, matched.value))
    const resultDesc = computed(() => computeResultDesc(url.value, urlInputting.value, matched.value))

    const changeInput = (newVal?: string) => {
        startInput()
        url.value = newVal?.trim()
    }

    const handleTest = async () => {
        endInput()
        matched.value = await limitService.select({ url: url.value, filterDisabled: true })
    }

    ctx.expose({
        show: () => {
            clearUrl()
            open()
            startInput()
            clearMatched()
        }
    } satisfies TestInstance)
    return () => (
        <ElDialog
            title={t(msg => msg.button.test)}
            modelValue={visible.value}
            closeOnClickModal={false}
            onClose={close}
        >
            <ElFormItem labelWidth={120} label={t(msg => msg.limit.button.test)}>
                <ElInput
                    modelValue={url.value}
                    clearable
                    onClear={() => changeInput()}
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
})

export default _default