/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard, ElDivider, ElInputNumber, ElOption, ElSelect, ElSwitch } from "element-plus"
import { t } from "@app/locale"
import { defineComponent, h, Ref, ref } from "vue"
import optionService from "@service/option-service"
import { ALL_DATA_ITEMS } from "@entity/dto/data-item"
import { renderOptionItem, renderHeader, tagText } from "../common"
import { defaultPopup } from "@util/constant/option"

const optionRef: Ref<Timer.PopupOption> = ref(defaultPopup())
optionService.getAllOption().then(option => optionRef.value = option)

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

const typeOptions = () => ALL_DATA_ITEMS.map(item => h(ElOption, { value: item, label: t(msg => msg.item[item]) }))
const typeSelect = () => h(ElSelect, {
    modelValue: optionRef.value.defaultType,
    size: 'mini',
    style: { width: '140px' },
    onChange: (val: Timer.DataDimension) => {
        optionRef.value.defaultType = val
        optionService.setPopupOption(optionRef.value)
    }
}, { default: typeOptions })

const displaySiteName = () => h(ElSwitch, {
    modelValue: optionRef.value.displaySiteName,
    onChange: (newVal: boolean) => {
        optionRef.value.displaySiteName = newVal
        optionService.setPopupOption(optionRef.value)
    }
})

const options = () => [
    renderOptionItem(typeSelect(), msg => msg.popup.type, t(msg => msg.item[defaultPopup().defaultType])),
    h(ElDivider),
    renderOptionItem(popupMaxInput(), msg => msg.popup.max, defaultPopup().popupMax),
    h(ElDivider),
    renderOptionItem({
        input: displaySiteName(),
        siteName: tagText(msg => msg.option.statistics.siteName)
    }, msg => msg.popup.displaySiteName, t(msg => msg.option.no))
]

const _default = defineComponent(() => {
    return () => h(ElCard, {
    }, {
        header: () => renderHeader(msg => msg.popup.title, () => optionService.setPopupOption(optionRef.value = defaultPopup())),
        default: options
    })
})

export default _default