import { ElCard, ElDivider, ElInputNumber, ElOption, ElSelect } from "element-plus"
import { t } from "../../../locale"
import { defineComponent, h, Ref, ref } from "vue"
import optionService from "../../../../service/option-service"
import { defaultValue } from "../../../../util/constant/option"
import { ALL_SITE_ITEMS } from "../../../../entity/dto/site-info"
import { renderOptionItem, renderHeader } from "../common"

const optionRef: Ref<Timer.PopupOption> = ref(defaultValue())
optionService.getPopupOption().then(option => optionRef.value = option)

const popupMaxInput = () => h(ElInputNumber, {
    modelValue: optionRef.value.popupMax,
    size: 'mini',
    min: 5,
    max: 30,
    onChange: (val: number) => {
        optionRef.value.popupMax = val
        optionService.setPopupOption(optionRef.value)
    }
})

const typeOptions = () => ALL_SITE_ITEMS.map(item => h(ElOption, { value: item, label: t(msg => msg.item[item]) }))
const typeSelect = () => h(ElSelect, {
    modelValue: optionRef.value.defaultType,
    size: 'mini',
    style: { width: '140px' },
    onChange: (val: Timer.SiteItem) => {
        optionRef.value.defaultType = val
        optionService.setPopupOption(optionRef.value)
    }
}, { default: typeOptions })

const options = () => [
    renderOptionItem(typeSelect(), msg => msg.popup.type, t(msg => msg.item[defaultValue().defaultType])),
    h(ElDivider),
    renderOptionItem(popupMaxInput(), msg => msg.popup.max, defaultValue().popupMax)
]

const _default = defineComponent(() => {
    return () => h(ElCard, {}, {
        header: renderHeader(msg => msg.popup.title, () => optionService.setPopupOption(optionRef.value = defaultValue())),
        default: options
    })
})

export default _default