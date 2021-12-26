/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElInput } from "element-plus"
import { Ref, h } from "vue"
import { t, tN } from "@app/locale"
import { DataManageMessage } from "@app/locale/components/data-manage"
import { stepNoClz } from "./constants"

const elInput = (valRef: Ref<string>, placeholder: string, min?: Ref<string>) =>
    h(ElInput, {
        class: 'filter-input',
        placeholder: placeholder,
        min: min !== undefined ? min.value || '0' : undefined,
        clearable: true,
        size: 'mini',
        modelValue: valRef.value,
        onInput: (val: string) => valRef.value = val.trim(),
        onClear: () => valRef.value = ''
    })

const numberFilter = (translateKey: keyof DataManageMessage, startRef: Ref<string>, endRef: Ref<string>, lineNo: number) => h('p', [
    h('a', { class: stepNoClz }, `${lineNo}.`),
    tN(msg => msg.dataManage[translateKey], {
        start: elInput(startRef, '0'),
        end: elInput(endRef, t(msg => msg.dataManage.unlimited), startRef)
    })
])

export default numberFilter