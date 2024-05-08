/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { UnwrapRef } from "vue"

import { ElColorPicker, ElMessageBox, ElOption, ElSelect, ElSwitch } from "element-plus"
import { defineComponent, reactive, unref, watch } from "vue"
import optionService from "@service/option-service"
import { defaultAppearance } from "@util/constant/option"
import DarkModeInput from "./DarkModeInput"
import { t, tWith } from "@app/locale"
import { OptionInstance, OptionItem, OptionTag } from "../../common"
import localeMessages from "@i18n/message/common/locale"
import { ALL_LOCALES, localeSameAsBrowser } from "@i18n"
import { toggle } from "@util/dark-mode"

const SORTED_LOCALES: timer.Locale[] = ALL_LOCALES
    // Keep the locale same as this browser first position
    .sort((a, _b) => a === localeSameAsBrowser ? -1 : 0)
const allLocaleOptions: timer.option.LocaleOption[] = ["default", ...SORTED_LOCALES]

function copy(target: timer.option.AppearanceOption, source: timer.option.AppearanceOption) {
    target.displayWhitelistMenu = source.displayWhitelistMenu
    target.displayBadgeText = source.displayBadgeText
    target.badgeBgColor = source.badgeBgColor
    target.locale = source.locale
    target.printInConsole = source.printInConsole
    target.darkMode = source.darkMode
    target.darkModeTimeStart = source.darkModeTimeStart
    target.darkModeTimeEnd = source.darkModeTimeEnd
}

const _default = defineComponent((_props, ctx) => {
    const option: UnwrapRef<timer.option.AppearanceOption> = reactive(defaultAppearance())
    optionService.getAllOption().then(currentVal => {
        copy(option, currentVal)
        watch(option, async () => {
            await optionService.setAppearanceOption(unref(option))
            toggle(await optionService.isDarkMode(option))
        })
    })
    ctx.expose({
        reset: () => copy(option, defaultAppearance())
    } satisfies OptionInstance)
    return () => (
        <div>
            <OptionItem
                label={msg => msg.option.appearance.darkMode.label}
                defaultValue={t(msg => msg.option.appearance.darkMode.options.default)}
                hideDivider
            >
                <DarkModeInput
                    modelValue={option.darkMode}
                    startSecond={option.darkModeTimeStart}
                    endSecond={option.darkModeTimeEnd}
                    onChange={async (darkMode, range) => {
                        option.darkMode = darkMode
                        option.darkModeTimeStart = range?.[0]
                        option.darkModeTimeEnd = range?.[1]
                    }}
                />
            </OptionItem>
            <OptionItem label={msg => msg.option.appearance.locale.label} defaultValue={t(msg => msg.option.appearance.locale.default)}>
                <ElSelect
                    modelValue={option.locale}
                    size="small"
                    style={{ width: "120px" }}
                    onChange={(newVal: timer.option.LocaleOption) => {
                        option.locale = newVal
                        // await maybe not work in Firefox, so calculate the real locale again
                        // GG Firefox
                        const realLocale: timer.Locale = newVal === "default"
                            ? localeSameAsBrowser
                            : newVal
                        ElMessageBox({
                            message: tWith(msg => msg.option.appearance.locale.changeConfirm, realLocale),
                            type: "success",
                            confirmButtonText: tWith(msg => msg.option.appearance.locale.reloadButton, realLocale),
                            // Cant close this on press ESC
                            closeOnPressEscape: false,
                            // Cant close this on clicking modal
                            closeOnClickModal: false
                        }).then(() => { location.reload?.() })
                            .catch(() => {/* do nothing */ })
                    }}
                >
                    {allLocaleOptions.map(locale => <ElOption
                        value={locale}
                        label={locale === "default" ? t(msg => msg.option.appearance.locale.default) : localeMessages[locale].name}
                    />)}
                </ElSelect>
            </OptionItem>
            <OptionItem
                label={msg => msg.option.appearance.displayWhitelist}
                defaultValue={t(msg => msg.option.yes)}
                v-slots={{
                    whitelist: () => <OptionTag>{t(msg => msg.option.appearance.whitelistItem)}</OptionTag>,
                    contextMenu: () => <OptionTag>{t(msg => msg.option.appearance.contextMenu)}</OptionTag>,
                }}
            >
                <ElSwitch
                    modelValue={option.displayWhitelistMenu}
                    onChange={(val: boolean) => option.displayWhitelistMenu = val}
                />
            </OptionItem>
            <OptionItem
                label={msg => msg.option.appearance.displayBadgeText}
                defaultValue={t(msg => msg.option.yes)}
                v-slots={{
                    timeInfo: () => <OptionTag>{t(msg => msg.option.appearance.badgeTextContent)}</OptionTag>,
                    icon: () => <OptionTag>{t(msg => msg.option.appearance.icon)}</OptionTag>,
                }}
            >
                <ElSwitch
                    modelValue={option.displayBadgeText}
                    onChange={(val: boolean) => option.displayBadgeText = val}
                />
            </OptionItem>
            <OptionItem
                v-show={option.displayBadgeText}
                label={msg => msg.option.appearance.badgeBgColor}
            >
                <ElColorPicker
                    size="small"
                    modelValue={option.badgeBgColor}
                    onChange={val => option.badgeBgColor = val}
                />
            </OptionItem>
            <OptionItem
                label={msg => msg.option.appearance.printInConsole.label}
                defaultValue={t(msg => msg.option.yes)}
                v-slots={{
                    console: () => <OptionTag>{t(msg => msg.option.appearance.printInConsole.console)}</OptionTag>,
                    info: () => <OptionTag>{t(msg => msg.option.appearance.printInConsole.info)}</OptionTag>,
                }}
            >
                <ElSwitch
                    modelValue={option.printInConsole}
                    onChange={(val: boolean) => option.printInConsole = val}
                />
            </OptionItem>
        </div>
    )
})

export default _default