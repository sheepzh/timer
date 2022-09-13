/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { unref, UnwrapRef } from "vue"

import { ElDivider, ElInputNumber, ElOption, ElSelect, ElSwitch } from "element-plus"
import { t } from "@app/locale"
import { defineComponent, h, reactive } from "vue"
import optionService from "@service/option-service"
import { renderOptionItem, tagText } from "../common"
import { defaultPopup } from "@util/constant/option"
import { ALL_POPUP_DURATION } from "@util/constant/popup"
import { ALL_DIMENSIONS } from "@util/stat"

const popupMaxInput = (option: UnwrapRef<timer.option.PopupOption>) => h(ElInputNumber, {
    modelValue: option.popupMax,
    size: 'small',
    min: 5,
    max: 30,
    onChange: (val: number) => {
        option.popupMax = val
        optionService.setPopupOption(unref(option))
    }
})

const typeOptions = () => ALL_DIMENSIONS.map(item => h(ElOption, { value: item, label: t(msg => msg.item[item]) }))
const typeSelect = (option: UnwrapRef<timer.option.PopupOption>) => h(ElSelect, {
    modelValue: option.defaultType,
    size: 'small',
    style: { width: '120px' },
    onChange: (val: timer.stat.Dimension) => {
        option.defaultType = val
        optionService.setPopupOption(unref(option))
    }
}, { default: typeOptions })

const durationOptions = () => ALL_POPUP_DURATION.map(item => h(ElOption, { value: item, label: t(msg => msg.option.popup.duration[item]) }))
const durationSelect = (option: UnwrapRef<timer.option.PopupOption>) => h(ElSelect, {
    modelValue: option.defaultDuration,
    size: 'small',
    style: { width: t(msg => msg.option.popup.durationWidth) },
    onChange: (val: timer.popup.Duration) => {
        option.defaultDuration = val
        optionService.setPopupOption(unref(option))
    }
}, { default: durationOptions })

const displaySiteName = (option: UnwrapRef<timer.option.PopupOption>) => h(ElSwitch, {
    modelValue: option.displaySiteName,
    onChange: (newVal: boolean) => {
        option.displaySiteName = newVal
        optionService.setPopupOption(option)
    }
})

const defaultPopOptions = defaultPopup()
const defaultTypeLabel = t(msg => msg.item[defaultPopOptions.defaultType])
const defaultDurationLabel = t(msg => msg.option.popup.duration[defaultPopOptions.defaultDuration])
const displayDefaultLabel = `${defaultDurationLabel}/${defaultTypeLabel}`

function copy(target: timer.option.PopupOption, source: timer.option.PopupOption) {
    target.defaultDuration = source.defaultDuration
    target.defaultType = source.defaultType
    target.displaySiteName = source.displaySiteName
    target.popupMax = source.popupMax
}

const _default = defineComponent({
    name: "PopupOptionContainer",
    setup(_props, ctx) {
        const option: UnwrapRef<timer.option.PopupOption> = reactive(defaultPopup())
        optionService.getAllOption().then(currentVal => copy(option, currentVal))
        ctx.expose({
            async reset() {
                copy(option, defaultPopup())
                await optionService.setPopupOption(unref(option))
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