/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { App, createApp } from "vue"
import Main from "./layout"
import 'element-plus/theme-chalk/index.css'
import './styles' // global css
import installRouter from "./router"
import '../common/timer'
import ElementPlus from 'element-plus'
import { locale as appLocale, Locale } from "@util/i18n"
import { Language } from "element-plus/lib/locale"

const locales: { [locale in Locale]: () => Promise<{ default: Language }> } = {
    zh_CN: () => import('element-plus/lib/locale/lang/zh-cn'),
    en: () => import('element-plus/lib/locale/lang/en'),
    ja: () => import('element-plus/lib/locale/lang/ja')
}

const app: App = createApp(Main)
installRouter(app)
app.mount('#app')

locales[appLocale]?.()?.then(locale => app.use(ElementPlus, { locale: locale.default }))