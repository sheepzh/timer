/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { App, createApp, defineComponent, h } from "vue"
import Main from "./layout"
import 'element-plus/theme-chalk/index.css'
import './styles' // global css
import installRouter from "./router"
import '../common/timer'
import { useLocale, useLocaleProps } from "element-plus"
import { locale as appLocale, Locale } from "../util/i18n"

const locales: { [locale in Locale]: () => Promise<{ default: unknown }> } = {
    zh_CN: () => import('element-plus/lib/locale/lang/zh-cn'),
    en: () => import('element-plus/lib/locale/lang/en'),
    ja: () => import('element-plus/lib/locale/lang/ja')
}

// Use proxy for the i18n of element-plus 
// @see https://element-plus.gitee.io/#/zh-CN/component/i18n
const AppMainProxy = defineComponent({
    props: { ...useLocaleProps },
    setup() {
        useLocale()
        return () => h(Main)
    }
})

const localeGetter = locales[appLocale]
localeGetter().then(locale => {
    const app: App = createApp(AppMainProxy, { locale: locale.default })
    installRouter(app)
    app.mount('#app')
})
