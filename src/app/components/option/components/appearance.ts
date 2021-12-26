/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard, ElDivider, ElSwitch } from "element-plus"
import { defineComponent, h, Ref, ref } from "vue"
import optionService from "@service/option-service"
import { defaultAppearance } from "@util/constant/option"
import { t } from "@app/locale"
import { renderHeader, renderOptionItem, tagText } from "../common"

const optionRef: Ref<Timer.AppearanceOption> = ref(defaultAppearance())
optionService.getAllOption().then(option => optionRef.value = option)

function updateOptionVal(key: keyof Timer.AppearanceOption, newVal: boolean) {
    const value = optionRef.value
    value[key] = newVal
    optionService.setAppearanceOption(value)
}

const displayWhitelist = () => h(ElSwitch, {
    modelValue: optionRef.value.displayWhitelistMenu,
    onChange: (newVal: boolean) => updateOptionVal('displayWhitelistMenu', newVal)
})

const displayBadgeText = () => h(ElSwitch, {
    modelValue: optionRef.value.displayBadgeText,
    onChange: (newVal: boolean) => updateOptionVal('displayBadgeText', newVal)
})

const options = () => [
    renderOptionItem({
        input: displayWhitelist(),
        whitelist: tagText(msg => msg.option.appearance.whitelistItem),
        contextMenu: tagText(msg => msg.option.appearance.contextMenu)
    }, msg => msg.appearance.displayWhitelist, t(msg => msg.option.yes)),
    h(ElDivider),
    renderOptionItem({
        input: displayBadgeText(),
        timeInfo: tagText(msg => msg.option.appearance.badgeTextContent),
        icon: tagText(msg => msg.option.appearance.icon)
    }, msg => msg.appearance.displayBadgeText, t(msg => msg.option.no))
]

const _default = defineComponent(() => {
    return () => h(ElCard, {
    }, {
        header: () => renderHeader(msg => msg.appearance.title, () => optionService.setAppearanceOption(optionRef.value = defaultAppearance())),
        default: options
    })
})

export default _default