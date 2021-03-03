import Vue from 'vue'
import {
    DatePicker,
    Icon, Input,
    Option,
    Pagination,
    Switch,
    Table, TableColumn
} from 'element-ui'

Vue.use(DatePicker)
import 'element-ui/lib/theme-chalk/date-picker.css'

Vue.use(Icon)
import 'element-ui/lib/theme-chalk/icon.css'

Vue.use(Input)
import 'element-ui/lib/theme-chalk/input.css'

Vue.use(Option)
import 'element-ui/lib/theme-chalk/option.css'

Vue.use(Pagination)
import 'element-ui/lib/theme-chalk/pagination.css'

Vue.use(Switch)
import 'element-ui/lib/theme-chalk/switch.css'

Vue.use(Table)
import 'element-ui/lib/theme-chalk/table.css'
Vue.use(TableColumn)
import 'element-ui/lib/theme-chalk/table-column.css'

import { locale as vueLocale } from '../common/vue-i18n'
import locale from 'element-ui/lib/locale'
import enLang from 'element-ui/lib/locale/lang/en'
import zhLang from 'element-ui/lib/locale/lang/zh-CN'
if (vueLocale === 'en') {
    locale.use(enLang)
} else if (vueLocale === 'zh_CN') {
    locale.use(zhLang)
}
