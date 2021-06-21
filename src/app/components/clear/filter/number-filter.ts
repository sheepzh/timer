import { ElInput } from "element-plus"
import { Ref, h } from "vue"
import { I18nKey, t, tN } from "../../../locale"
import { ClearMessage } from "../../../locale/components/clear"
import { stepNoClz } from "./consts"

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

const numberFilter = (translateKey: keyof ClearMessage, startRef: Ref<string>, endRef: Ref<string>, lineNo: number) => h('p', [
    h('a', { class: stepNoClz }, `${lineNo}.`),
    tN(msg => msg.clear[translateKey], {
        start: elInput(startRef, '0'),
        end: elInput(endRef, t(msg => msg.clear.unlimited), startRef)
    })
])

export default numberFilter