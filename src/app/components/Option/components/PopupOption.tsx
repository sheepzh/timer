/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { unref, watch } from "vue"
import { ElInputNumber, ElOption, ElSelect, ElSwitch } from "element-plus"
import { t } from "@app/locale"
import { I18nKey, t as t_ } from "@i18n"
import { defineComponent, reactive } from "vue"
import optionService from "@service/option-service"
import { OptionInstance, OptionItem, OptionTag } from "../common"
import { defaultPopup } from "@util/constant/option"
import { ALL_POPUP_DURATION } from "@util/constant/popup"
import { ALL_DIMENSIONS } from "@util/stat"

type LocaleStyle = {
    durationSelectWidth: number
    typeSelectWidth: number
}

const STYLES: Messages<LocaleStyle> = {
    zh_CN: {
        typeSelectWidth: 85,
        durationSelectWidth: 80,
    },
    en: {
        typeSelectWidth: 115,
        durationSelectWidth: 110
    },
    ja: {
        typeSelectWidth: 85,
        durationSelectWidth: 105,
    },
    pt_PT: {
        typeSelectWidth: 155,
        durationSelectWidth: 120,
    },
    zh_TW: {
        typeSelectWidth: 85,
        durationSelectWidth: 80,
    },
}

const tStyle = (key: I18nKey<LocaleStyle>) => t_(STYLES, { key })

const defaultPopOptions = defaultPopup()
const defaultTypeLabel = t(msg => msg.item[defaultPopOptions.defaultType])
const defaultDurationLabel = t(msg => msg.duration[defaultPopOptions.defaultDuration])
const displayDefaultLabel = `${defaultDurationLabel}/${defaultTypeLabel}`

function copy(target: timer.option.PopupOption, source: timer.option.PopupOption) {
    target.defaultMergeDomain = source.defaultMergeDomain
    target.defaultDuration = source.defaultDuration
    target.defaultType = source.defaultType
    target.displaySiteName = source.displaySiteName
    target.popupMax = source.popupMax
}

const _default = defineComponent((_props, ctx) => {
    const option = reactive(defaultPopup())
    optionService.getAllOption()
        .then(currentVal => {
            copy(option, currentVal)
            watch(option, () => optionService.setPopupOption(unref(option)))
        })
    ctx.expose({
        reset: () => copy(option, defaultPopup())
    } satisfies OptionInstance)
    return () => <>
        <OptionItem
            label={msg => msg.option.popup.defaultMergeDomain}
            defaultValue={t(msg => msg.option.no)}
            hideDivider
        >
            <ElSwitch
                modelValue={option.defaultMergeDomain}
                onChange={(val: boolean) => option.defaultMergeDomain = val}
            />
        </OptionItem>
        <OptionItem
            label={msg => msg.option.popup.defaultDisplay}
            defaultValue={displayDefaultLabel}
            v-slots={{
                duration: () => (
                    <ElSelect
                        modelValue={option.defaultDuration}
                        size="small"
                        style={{ width: `${tStyle(m => m.durationSelectWidth)}px` }}
                        onChange={(val: PopupDuration) => option.defaultDuration = val}
                    >
                        {ALL_POPUP_DURATION.map(item => <ElOption value={item} label={t(msg => msg.duration[item])} />)}
                    </ElSelect>
                ),
                type: () => (
                    <ElSelect
                        modelValue={option.defaultType}
                        size="small"
                        style={{ width: `${tStyle(m => m.typeSelectWidth)}px` }}
                        onChange={(val: timer.stat.Dimension) => option.defaultType = val}
                    >
                        {ALL_DIMENSIONS.map(item => <ElOption value={item} label={t(msg => msg.item[item])} />)}
                    </ElSelect>
                )
            }}
        />
        <OptionItem
            label={msg => msg.option.popup.max}
            defaultValue={defaultPopOptions.popupMax}
        >
            <ElInputNumber
                modelValue={option.popupMax}
                size="small"
                min={5}
                max={30}
                onChange={val => option.popupMax = val}
            />
        </OptionItem>
        <OptionItem
            label={msg => msg.option.popup.displaySiteName}
            defaultValue={t(msg => msg.option.yes)}
            v-slots={{
                siteName: () => <OptionTag>{t(msg => msg.option.statistics.siteName)}</OptionTag>
            }}
        >
            <ElSwitch
                modelValue={option.displaySiteName}
                onChange={(val: boolean) => option.displaySiteName = val}
            />
        </OptionItem>
    </>
})

export default _default