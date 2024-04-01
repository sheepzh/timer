/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElInput } from "element-plus"
import { defineComponent, PropType, ref, watch } from "vue"
import { t } from "@app/locale"
import { DataManageMessage } from "@i18n/message/app/data-manage"
import I18nNode from "@app/components/common/I18nNode"

const elInput = (val: string, setter: (val?: string) => void, placeholder: string) => <ElInput
    class="filter-input"
    placeholder={placeholder}
    clearable
    size="small"
    modelValue={val}
    onInput={val => setter?.(val?.trim())}
    onClear={() => setter?.()}
/>

const _default = defineComponent({
    props: {
        translateKey: String as PropType<keyof DataManageMessage>,
        defaultValue: Object as PropType<[string, string]>,
        lineNo: Number,
    },
    emits: {
        change: (_val: [string, string]) => true,
    },
    setup(props, ctx) {
        const start = ref(props.defaultValue?.[0])
        const end = ref(props.defaultValue?.[1])
        watch([start, end], () => ctx.emit("change", [start.value, end.value]))

        return () => (
            <p>
                <a class="step-no">{props.lineNo}.</a>
                <I18nNode
                    path={msg => msg.dataManage[props.translateKey]}
                    param={{
                        start: elInput(start.value, v => start.value = v, '0'),
                        end: elInput(end.value, v => end.value = v, t(msg => msg.dataManage.unlimited))
                    }}
                />
            </p>
        )
    }
})

export default _default