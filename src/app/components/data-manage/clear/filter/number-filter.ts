/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElInput } from "element-plus"
import { h, defineComponent, PropType } from "vue"
import { t, tN } from "@app/locale"
import { DataManageMessage } from "@i18n/message/app/data-manage"
import { stepNoClz } from "./constants"

const elInput = (val: string, setter: (val: string) => void, placeholder: string, min?: string) =>
    h(ElInput, {
        class: 'filter-input',
        placeholder: placeholder,
        min: min !== undefined ? min || '0' : undefined,
        clearable: true,
        size: 'small',
        modelValue: val,
        onInput: (val: string) => setter?.(val.trim()),
        onClear: () => setter?.('')
    })


const _default = defineComponent({
    name: "NumberFilter",
    props: {
        translateKey: String as PropType<keyof DataManageMessage>,
        start: String,
        end: String,
        lineNo: Number,
    },
    emits: {
        startChange: (_val: string) => true,
        endChange: (_val: string) => true,
    },
    setup(props, ctx) {
        return () => h('p', [
            h('a', { class: stepNoClz }, `${props.lineNo}.`),
            tN(msg => msg.dataManage[props.translateKey], {
                start: elInput(props.start, v => ctx.emit('startChange', v), '0'),
                end: elInput(props.end, v => ctx.emit('endChange', v), t(msg => msg.dataManage.unlimited), props.start)
            })
        ])
    }
})

export default _default