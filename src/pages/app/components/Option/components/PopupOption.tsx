/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { t } from "@app/locale"
import { IS_ANDROID } from "@util/constant/environment"
import { defaultPopup } from "@util/constant/option"
import { ElInputNumber, ElSwitch } from "element-plus"
import { defineComponent } from "vue"
import { type OptionInstance } from "../common"
import { useOption } from "../useOption"
import OptionItem from "./OptionItem"
import OptionTag from "./OptionTag"

const defaultPopOptions = defaultPopup()

function copy(target: timer.option.PopupOption, source: timer.option.PopupOption) {
    target.displaySiteName = source.displaySiteName
    target.popupMax = source.popupMax
}

const _default = defineComponent((_props, ctx) => {
    const { option } = useOption<timer.option.PopupOption>({ defaultValue: defaultPopup, copy })

    ctx.expose({
        reset: () => copy(option, defaultPopup())
    } satisfies OptionInstance)

    return () => <>
        <OptionItem
            hideDivider
            label={msg => msg.option.popup.max}
            defaultValue={defaultPopOptions.popupMax}
        >
            <ElInputNumber
                modelValue={option.popupMax}
                size="small"
                min={5}
                max={100}
                onChange={val => option.popupMax = val!}
            />
        </OptionItem>
        {!IS_ANDROID && (
            <OptionItem
                label={msg => msg.option.popup.displaySiteName}
                defaultValue={t(msg => msg.option.yes)}
                v-slots={{
                    siteName: () => <OptionTag>{t(msg => msg.option.statistics.siteName)}</OptionTag>
                }}
            >
                <ElSwitch
                    modelValue={option.displaySiteName}
                    onChange={val => option.displaySiteName = val as boolean}
                />
            </OptionItem>
        )}
    </>
})

export default _default
