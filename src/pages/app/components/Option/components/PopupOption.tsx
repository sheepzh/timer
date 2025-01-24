/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { t } from "@app/locale"
import { type I18nKey, t as t_ } from "@i18n"
import DurationSelect, { rangeLabel } from "@popup/components/Footer/DurationSelect"
import { defaultPopup } from "@util/constant/option"
import { ALL_DIMENSIONS } from "@util/stat"
import { ElInputNumber, ElOption, ElSelect, ElSwitch } from "element-plus"
import { defineComponent } from "vue"
import { type OptionInstance } from "../common"
import { useOption } from "../useOption"
import OptionItem from "./OptionItem"
import OptionTag from "./OptionTag"

type LocaleStyle = {
    /**
     * Width of duration select
     */
    duration: number
    /**
     * Width and type select
     */
    type: number
}

const STYLES: Messages<LocaleStyle> = {
    zh_CN: { type: 85, duration: 100 },
    en: { type: 115, duration: 110 },
    ja: { type: 85, duration: 110 },
    pt_PT: { type: 155, duration: 120 },
    zh_TW: { type: 85, duration: 100 },
    uk: { type: 145, duration: 120 },
    es: { type: 160, duration: 125 },
    de: { duration: 120 },
    fr: { type: 150, duration: 130 },
    ru: { type: 170, duration: 150 },
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
    const { option } = useOption({ defaultValue: defaultPopup, copy })

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
                        style={{ width: `${tStyle(m => m.duration)}px` }}
                    />
                ),
                type: () => (
                    <ElSelect
                        modelValue={option.defaultType}
                        size="small"
                        style={{ width: `${tStyle(m => m.type)}px` }}
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
