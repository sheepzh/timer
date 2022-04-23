/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard, ElDivider, ElIcon, ElMessageBox, ElOption, ElSelect, ElSwitch, ElTooltip } from "element-plus"
import { defineComponent, h, Ref, ref } from "vue"
import optionService from "@service/option-service"
import { defaultAppearance } from "@util/constant/option"
import { t } from "@app/locale"
import { renderHeader, renderOptionItem, tagText } from "../common"
import localeMessages from "@util/i18n/components/locale"
import { InfoFilled } from "@element-plus/icons-vue"

const optionRef: Ref<Timer.AppearanceOption> = ref(defaultAppearance())
optionService.getAllOption().then(option => optionRef.value = option)

const displayWhitelist = () => h(ElSwitch, {
    modelValue: optionRef.value.displayWhitelistMenu,
    onChange: (newVal: boolean) => {
        optionRef.value.displayWhitelistMenu = newVal
        optionService.setAppearanceOption(optionRef.value)
    }
})

const displayBadgeText = () => h(ElSwitch, {
    modelValue: optionRef.value.displayBadgeText,
    onChange: (newVal: boolean) => {
        optionRef.value.displayBadgeText = newVal
        optionService.setAppearanceOption(optionRef.value)
    }
})

const printInConsole = () => h(ElSwitch, {
    modelValue: optionRef.value.printInConsole,
    onChange: (newVal: boolean) => {
        optionRef.value.printInConsole = newVal
        optionService.setAppearanceOption(optionRef.value)
    }
})

const allLocaleOptions: Timer.LocaleOption[] = ["default", "zh_CN", "en", "ja"]
const locale = () => h(ElSelect, {
    modelValue: optionRef.value.locale,
    size: 'mini',
    style: { width: '120px' },
    onChange: async (newVal: Timer.LocaleOption) => {
        optionRef.value.locale = newVal
        await optionService.setAppearanceOption(optionRef.value)
        ElMessageBox({
            message: t(msg => msg.option.appearance.locale.changeConfirm),
            type: "success",
            confirmButtonText: t(msg => msg.option.appearance.locale.reloadButton),
            // Cant close this on press ESC
            closeOnPressEscape: false,
            // Cant close this on clicking modal
            closeOnClickModal: false
        }).then(() => { location.reload?.() })
            .catch(() => {/* do nothing */ })
    }
}, {
    default: () => allLocaleOptions.map(
        locale => h(ElOption, {
            value: locale, label: locale === "default"
                ? t(msg => msg.option.appearance.locale.default)
                : localeMessages[locale].name
        })
    )
})

const options = () => [
    renderOptionItem({
        input: locale(),
        info: h(ElTooltip, {}, {
            default: () => h(ElIcon, { size: 15 }, () => h(InfoFilled)),
            content: () => [
                t(msg => msg.option.appearance.locale.infoL1),
                h('br'),
                h('br'),
                t(msg => msg.option.appearance.locale.infoL2)
            ]
        })
    },
        msg => msg.appearance.locale.label,
        t(msg => msg.option.appearance.locale.default)
    ),
    h(ElDivider),
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
    }, msg => msg.appearance.displayBadgeText, t(msg => msg.option.no)),
    h(ElDivider),
    renderOptionItem({
        input: printInConsole(),
    }, msg => msg.appearance.printInConsole, t(msg => msg.option.yes))
]

const _default = defineComponent(() => {
    return () => h(ElCard, {
    }, {
        header: () => renderHeader(msg => msg.appearance.title, () => optionService.setAppearanceOption(optionRef.value = defaultAppearance())),
        default: options
    })
})

export default _default