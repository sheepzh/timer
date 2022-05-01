/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElDivider, ElInputNumber, ElOption, ElSelect, ElSwitch } from "element-plus"
import { t } from "@app/locale"
import { defineComponent, h, Ref, ref } from "vue"
import optionService from "@service/option-service"
import { ALL_DATA_ITEMS } from "@entity/dto/data-item"
import { renderOptionItem, tagText } from "../common"
import { defaultPopup } from "@util/constant/option"
import { ALL_POPUP_DURATION } from "@util/constant/popup"

const popupMaxInput = (option: Ref<Timer.PopupOption>) => h(ElInputNumber, {
    modelValue: option.value.popupMax,
    size: 'mini',
    min: 5,
    max: 30,
    onChange: (val: number) => {
        option.value.popupMax = val
        optionService.setPopupOption(option.value)
    }
})

const typeOptions = () => ALL_DATA_ITEMS.map(item => h(ElOption, { value: item, label: t(msg => msg.item[item]) }))
const typeSelect = (option: Ref<Timer.PopupOption>) => h(ElSelect, {
    modelValue: option.value.defaultType,
    size: 'mini',
    style: { width: '120px' },
    onChange: (val: Timer.DataDimension) => {
        option.value.defaultType = val
        optionService.setPopupOption(option.value)
    }
}, { default: typeOptions })

const durationOptions = () => ALL_POPUP_DURATION.map(item => h(ElOption, { value: item, label: t(msg => msg.option.popup.duration[item]) }))
const durationSelect = (option: Ref<Timer.PopupOption>) => h(ElSelect, {
    modelValue: option.value.defaultDuration,
    size: 'mini',
    style: { width: t(msg => msg.option.popup.durationWidth) },
    onChange: (val: Timer.PopupDuration) => {
        option.value.defaultDuration = val
        optionService.setPopupOption(option.value)
    }
}, { default: durationOptions })

const displaySiteName = (option: Ref<Timer.PopupOption>) => h(ElSwitch, {
    modelValue: option.value.displaySiteName,
    onChange: (newVal: boolean) => {
        option.value.displaySiteName = newVal
        optionService.setPopupOption(option.value)
    }
})

const defaultPopOptions = defaultPopup()
const defaultTypeLabel = t(msg => msg.item[defaultPopOptions.defaultType])
const defaultDurationLabel = t(msg => msg.option.popup.duration[defaultPopOptions.defaultDuration])
const displayDefaultLabel = `${defaultDurationLabel}/${defaultTypeLabel}`

const _default = defineComponent({
    name: "PopupOptionContainer",
    setup(_props, ctx) {
        const option: Ref<Timer.PopupOption> = ref(defaultPopup())
        optionService.getAllOption().then(currentVal => option.value = currentVal)
        ctx.expose({
            async reset() {
                option.value = defaultPopup()
                await optionService.setPopupOption(option.value)
            }
        })
        return () => h('div', [
            renderOptionItem({
                duration: durationSelect(option),
                type: typeSelect(option)
            },
                msg => msg.popup.defaultDisplay,
                displayDefaultLabel
            ),
            h(ElDivider),
            renderOptionItem(popupMaxInput(option), msg => msg.popup.max, defaultPopOptions.popupMax),
            h(ElDivider),
            renderOptionItem({
                input: displaySiteName(option),
                siteName: tagText(msg => msg.option.statistics.siteName)
            }, msg => msg.popup.displaySiteName, t(msg => msg.option.yes))
        ])
    }
})

export default _default