// Process locale
import { locale } from '../common/vue-i18n'
import zhLocale from 'element-plus/lib/locale/lang/zh-cn'
import enLang from 'element-plus/lib/locale/lang/en'
import { locale as eleLocale } from 'element-plus'
import { Locale } from '../locale/constant'

if (locale === Locale.EN) {
    eleLocale(enLang)
} else if (locale === Locale.ZH_CN) {
    eleLocale(zhLocale)
}