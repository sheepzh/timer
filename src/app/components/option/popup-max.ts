import { ElInputNumber } from "element-plus"
import { defineComponent, h, Ref, ref } from "vue"
import { tN } from "../../locale/index"

const popupMaxRef: Ref<number> = ref()



const inputNumber = () => h(ElInputNumber, { size: 'mini', min: 5 })

export default defineComponent(() => {
    return () => h('span', tN(msg => msg.option.popupMax, { input: inputNumber() }))
})