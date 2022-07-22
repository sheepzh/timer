/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Language } from "element-plus/lib/locale"

import "./style"

import { initLocale, locale as appLocale } from "@util/i18n"
import { init as initTheme } from "@util/dark-mode"
import { createApp } from "vue"
import Main from "./layout"
import ElementPlus from 'element-plus'


const locales: { [locale in timer.Locale]: () => Promise<{ default: Language }> } = {
    zh_CN: () => import('element-plus/lib/locale/lang/zh-cn'),
    zh_TW: () => import('element-plus/lib/locale/lang/zh-tw'),
    en: () => import('element-plus/lib/locale/lang/en'),
    ja: () => import('element-plus/lib/locale/lang/ja')
}

async function main() {
    initTheme()
    await initLocale()

    const app = createApp(Main)
    app.mount('#app')
    locales[appLocale]?.()?.then(locale => app.use(ElementPlus, { locale: locale.default }))
}

main()