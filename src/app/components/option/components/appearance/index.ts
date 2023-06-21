/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { UnwrapRef } from "vue"

import { ElDivider, ElMessageBox, ElOption, ElSelect, ElSwitch } from "element-plus"
import { defineComponent, reactive, unref, h } from "vue"
import optionService from "@service/option-service"
import { defaultAppearance } from "@util/constant/option"
import DarkModeInput from "./dark-mode-input"
import { t, tWith } from "@app/locale"
import { renderOptionItem, tagText } from "../../common"
import localeMessages from "@i18n/message/common/locale"
import { ALL_LOCALES, localeSameAsBrowser } from "@i18n"
import { toggle } from "@util/dark-mode"

const displayWhitelist = (option: UnwrapRef<timer.option.AppearanceOption>) => h(ElSwitch, {
    modelValue: option.displayWhitelistMenu,
    onChange: (newVal: boolean) => {
        option.displayWhitelistMenu = newVal
        optionService.setAppearanceOption(unref(option))
    }
})

const displayBadgeText = (option: UnwrapRef<timer.option.AppearanceOption>) => h(ElSwitch, {
    modelValue: option.displayBadgeText,
    onChange: (newVal: boolean) => {
        option.displayBadgeText = newVal
        optionService.setAppearanceOption(unref(option))
    }
})

const printInConsole = (option: UnwrapRef<timer.option.AppearanceOption>) => h(ElSwitch, {
    modelValue: option.printInConsole,
    onChange: (newVal: boolean) => {
        option.printInConsole = newVal
        optionService.setAppearanceOption(unref(option))
    }
})

const SORTED_LOCALES: timer.Locale[] = ALL_LOCALES
    // Keep the locale same as this browser first position
    .sort((a, _b) => a === localeSameAsBrowser ? -1 : 0)
const allLocaleOptions: timer.option.LocaleOption[] = ["default", ...SORTED_LOCALES]

const locale = (option: UnwrapRef<timer.option.AppearanceOption>) => h(ElSelect, {
    modelValue: option.locale,
    size: 'small',
    style: { width: '120px' },
    onChange: async (newVal: timer.option.LocaleOption) => {
        option.locale = newVal
        await optionService.setAppearanceOption(unref(option))
        // await maybe not work in Firefox, so calculate the real locale again
        // GG Firefox
        const realLocale: timer.Locale = newVal === "default"
            ? localeSameAsBrowser
            : newVal
        ElMessageBox({
            message: tWith(msg => msg.option.appearance.locale.changeConfirm, realLocale),
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

function copy(target: timer.option.AppearanceOption, source: timer.option.AppearanceOption) {
    target.displayWhitelistMenu = source.displayWhitelistMenu
    target.displayBadgeText = source.displayBadgeText
    target.locale = source.locale
    target.printInConsole = source.printInConsole
    target.darkMode = source.darkMode
    target.darkModeTimeStart = source.darkModeTimeStart
    target.darkModeTimeEnd = source.darkModeTimeEnd
    target.limitMarkFilter = source.limitMarkFilter
}

const _default = defineComponent((_props, ctx) => {
    const option: UnwrapRef<timer.option.AppearanceOption> = reactive(defaultAppearance())
    optionService.getAllOption().then(currentVal => copy(option, currentVal))
    ctx.expose({
        async reset() {
            copy(option, defaultAppearance())
            await optionService.setAppearanceOption(unref(option))
            toggle(await optionService.isDarkMode(option))
        }
    })
    return () => h('div', [
        renderOptionItem({
            input: h(DarkModeInput, {
                modelValue: option.darkMode,
                startSecond: option.darkModeTimeStart,
                endSecond: option.darkModeTimeEnd,
                onChange: async (darkMode, range) => {
                    option.darkMode = darkMode
                    option.darkModeTimeStart = range?.[0]
                    option.darkModeTimeEnd = range?.[1]
                    await optionService.setAppearanceOption(unref(option))
                    toggle(await optionService.isDarkMode())
                }
            })
        },
            msg => msg.appearance.darkMode.label,
            t(msg => msg.option.appearance.darkMode.options.default)),
        h(ElDivider),
        renderOptionItem({
            input: locale(option)
        },
            msg => msg.appearance.locale.label,
            t(msg => msg.option.appearance.locale.default)
        ),
        h(ElDivider),
        renderOptionItem({
            input: displayWhitelist(option),
            whitelist: tagText(msg => msg.option.appearance.whitelistItem),
            contextMenu: tagText(msg => msg.option.appearance.contextMenu)
        }, msg => msg.appearance.displayWhitelist, t(msg => msg.option.yes)),
        h(ElDivider),
        renderOptionItem({
            input: displayBadgeText(option),
            timeInfo: tagText(msg => msg.option.appearance.badgeTextContent),
            icon: tagText(msg => msg.option.appearance.icon)
        }, msg => msg.appearance.displayBadgeText, t(msg => msg.option.yes)),
        h(ElDivider),
        renderOptionItem({
            input: printInConsole(option),
            console: tagText(msg => msg.option.appearance.printInConsole.console),
            info: tagText(msg => msg.option.appearance.printInConsole.info)
        }, msg => msg.appearance.printInConsole.label, t(msg => msg.option.yes)),
    ])
})

export default _default