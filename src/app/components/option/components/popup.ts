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
import { ALL_POPUP_DURATION } from "@util/constant/popup"

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
    style: { width: '120px' },
    onChange: (val: Timer.DataDimension) => {
        optionRef.value.defaultType = val
        optionService.setPopupOption(optionRef.value)
    }
}, { default: typeOptions })

const durationOptions = () => ALL_POPUP_DURATION.map(item => h(ElOption, { value: item, label: t(msg => msg.option.popup.duration[item]) }))
const durationSelect = () => h(ElSelect, {
    modelValue: optionRef.value.defaultDuration,
    size: 'mini',
    style: { width: t(msg => msg.option.popup.durationWidth) },
    onChange: (val: Timer.PopupDuration) => {
        optionRef.value.defaultDuration = val
        optionService.setPopupOption(optionRef.value)
    }
}, { default: durationOptions })

const displaySiteName = () => h(ElSwitch, {
    modelValue: optionRef.value.displaySiteName,
    onChange: (newVal: boolean) => {
        optionRef.value.displaySiteName = newVal
        optionService.setPopupOption(optionRef.value)
    }
})

const defaultPopOptions = defaultPopup()
const defaultTypeLabel = t(msg => msg.item[defaultPopOptions.defaultType])
const defaultDurationLabel = t(msg => msg.option.popup.duration[defaultPopOptions.defaultDuration])
const displayDefaultLabel = `${defaultDurationLabel}/${defaultTypeLabel}`
const options = () => [
    renderOptionItem({
        duration: durationSelect(),
        type: typeSelect()
    },
        msg => msg.popup.defaultDisplay,
        displayDefaultLabel
    ),
    h(ElDivider),
    renderOptionItem(popupMaxInput(), msg => msg.popup.max, defaultPopOptions.popupMax),
    h(ElDivider),
    renderOptionItem({
        input: displaySiteName(),
        siteName: tagText(msg => msg.option.statistics.siteName)
    }, msg => msg.popup.displaySiteName, t(msg => msg.option.yes))
]

const _default = defineComponent(() => {
    return () => h(ElCard, {
    }, {
        header: () => renderHeader(msg => msg.popup.title, () => optionService.setPopupOption(optionRef.value = defaultPopup())),
        default: options
    })
})

export default _default