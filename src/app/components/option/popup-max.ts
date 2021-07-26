import { ElInputNumber } from "element-plus"
import { defineComponent, h, Ref, ref } from "vue"
import optionService from "../../../service/option-service"
import { tN } from "../../locale/index"

const popupMaxRef: Ref<number> = ref(0)

optionService.getPopupMax().then(max => popupMaxRef.value = max)


const inputNumber = () => h(ElInputNumber, {
    modelValue: popupMaxRef.value,
    size: 'mini',
    min: 5,
    max: 100,
    onChange: (val: number) => optionService.setPopupMax(popupMaxRef.value = val)
})

export default defineComponent(() => {
    return () => h('span', tN(msg => msg.option.popupMax, { input: inputNumber() }))
})