/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { t } from "@app/locale"
import { type I18nKey, t as t_ } from "@i18n"
import DurationSelect, { rangeLabel } from "@popup/components/Footer/DurationSelect"
import optionService from "@service/option-service"
import { defaultPopup } from "@util/constant/option"
import { ALL_DIMENSIONS } from "@util/stat"
import { ElInputNumber, ElOption, ElSelect, ElSwitch } from "element-plus"
import { defineComponent, onBeforeMount, reactive, unref, watch } from "vue"
import { type OptionInstance } from "../common"
import OptionItem from "./OptionItem"
import OptionTag from "./OptionTag"

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
const defaultDurationLabel = rangeLabel(defaultPopOptions.defaultDuration, defaultPopOptions.defaultDurationNum)
const displayDefaultLabel = `${defaultDurationLabel}/${defaultTypeLabel}`

function copy(target: timer.option.PopupOption, source: timer.option.PopupOption) {
    target.defaultMergeMethod = source.defaultMergeMethod
    target.defaultDuration = source.defaultDuration
    target.defaultDurationNum = source.defaultDurationNum
    target.defaultType = source.defaultType
    target.displaySiteName = source.displaySiteName
    target.popupMax = source.popupMax
}

const _default = defineComponent((_props, ctx) => {
    const option = reactive(defaultPopup())

    onBeforeMount(async () => {
        const currentVal = await optionService.getAllOption()
        copy(option, currentVal)
        watch(option, () => optionService.setPopupOption(unref(option)))
    })

    ctx.expose({
        reset: () => copy(option, defaultPopup())
    } satisfies OptionInstance)

    return () => <>
        <OptionItem
            label={msg => msg.option.popup.defaultMergeMethod}
            defaultValue={t(msg => msg.shared.merge.mergeMethod.notMerge)}
            hideDivider
        >
            <ElSelect
                size="small"
                modelValue={option.defaultMergeMethod}
                placeholder={t(msg => msg.shared.merge.mergeMethod.notMerge)}
                onChange={(val: timer.stat.MergeMethod) => option.defaultMergeMethod = val || undefined}
            >
                <ElOption value={''} label={t(msg => msg.shared.merge.mergeMethod.notMerge)} />
                {(['domain', 'cate'] satisfies timer.stat.MergeMethod[]).map(m => (
                    <ElOption value={m} label={t(msg => msg.shared.merge.mergeMethod[m])} />
                ))}
            </ElSelect>
        </OptionItem>
        <OptionItem
            label={msg => msg.option.popup.defaultDisplay}
            defaultValue={displayDefaultLabel}
            v-slots={{
                duration: () => (
                    <DurationSelect
                        size="small"
                        expandTrigger="hover"
                        modelValue={[option.defaultDuration, option.defaultDurationNum]}
                        onChange={([duration, num]) => {
                            option.defaultDuration = duration
                            option.defaultDurationNum = num
                        }}
                    />
                ),
                type: () => (
                    <ElSelect
                        modelValue={option.defaultType}
                        size="small"
                        style={{ width: `${tStyle(m => m.typeSelectWidth)}px` }}
                        onChange={(val: timer.core.Dimension) => option.defaultType = val}
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
                max={100}
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
