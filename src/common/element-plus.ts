// Process locale
import { Locale, locale } from '../util/i18n'
import zhLocale from 'element-plus/lib/locale/lang/zh-cn'
import enLang from 'element-plus/lib/locale/lang/en'
import { locale as eleLocale } from 'element-plus'

if (locale === Locale.EN) {
    eleLocale(enLang)
} else if (locale === Locale.ZH_CN) {
    eleLocale(zhLocale)
}