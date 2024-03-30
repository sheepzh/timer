/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Language } from "element-plus/lib/locale"

import { App, createApp } from "vue"
import 'element-plus/theme-chalk/index.css'
import '../common/timer'
import ElementPlus, { ElLoadingDirective } from 'element-plus'
import Main from "./Layout"
import { initLocale, locale as sideLocale } from "@i18n"
import { toggle, init as initTheme } from "@util/dark-mode"
import optionService from "@service/option-service"
import "./style.sass"

const locales: { [locale in timer.Locale]: () => Promise<{ default: Language }> } = {
    zh_CN: () => import('element-plus/lib/locale/lang/zh-cn'),
    zh_TW: () => import('element-plus/lib/locale/lang/zh-tw'),
    en: () => import('element-plus/lib/locale/lang/en'),
    ja: () => import('element-plus/lib/locale/lang/ja'),
    pt_PT: () => import('element-plus/lib/locale/lang/pt'),
    uk: () => import('element-plus/lib/locale/lang/uk'),
    es: () => import('element-plus/lib/locale/lang/es'),
    de: () => import('element-plus/lib/locale/lang/de'),
}

async function main() {
    // Init theme with cache first
    initTheme()
    // Calculate the latest mode
    optionService.isDarkMode().then(toggle)
    await initLocale()
    const app: App = createApp(Main)
    app.directive("loading", ElLoadingDirective)
    const locale = await locales[sideLocale]?.()
    app.use(ElementPlus, { locale: locale.default })
    app.mount('#app')
}

main()