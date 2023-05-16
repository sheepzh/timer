/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElDropdown, ElDropdownItem, ElDropdownMenu } from "element-plus"
import { defineComponent, h } from "vue"
import { getI18nVal, locale as current, ALL_LOCALES } from "@i18n"
import localeMessages from "@i18n/message/common/locale"
import SvgIcon from "./svg-icon"
import { LOCALE_PATH } from "./svg"
import optionService from "@service/option-service"
import { createTabAfterCurrent } from "@api/chrome/tab"
import { CROWDIN_HOMEPAGE } from "@util/constant/url"

const HELP_CMD: string = '_help'

const getLocaleName = (locale: timer.Locale) => getI18nVal(localeMessages, msg => msg.name, locale)

const renderIcon = () => h('div',
    { class: 'locale-button' },
    [
        h(SvgIcon, { path: LOCALE_PATH }),
        h('span', getLocaleName(current))
    ]
)

const renderLocaleItem = (locale: timer.Locale) => h(ElDropdownItem, {
    disabled: current === locale,
    command: locale,
}, () => getLocaleName(locale))

const renderHelpItem = () => h(ElDropdownItem, {
    divided: true,
    command: HELP_CMD,
}, () => 'Help translate!')

const renderMenuItems = () => h(ElDropdownMenu,
    () => [
        ...ALL_LOCALES.map(renderLocaleItem),
        renderHelpItem(),
    ]
)

const handleCommand = async (cmd: string) => {
    if (cmd === HELP_CMD) {
        createTabAfterCurrent(CROWDIN_HOMEPAGE)
        return
    }
    const locale = cmd as timer.Locale
    const option = await optionService.getAllOption()
    option.locale = locale
    await optionService.setAppearanceOption(option)
    window.location.reload?.()
}

const _default = defineComponent(() => {
    return () => h(ElDropdown, {
        class: 'locale-select',
        onCommand: handleCommand
    }, {
        default: () => renderIcon(),
        dropdown: () => renderMenuItems()
    })
})

export default _default