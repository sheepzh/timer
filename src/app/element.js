import Vue from 'vue'
import {
    Alert, Aside,
    Button,
    Card, Col, Container,
    DatePicker, Dropdown, DropdownMenu, DropdownItem,
    Icon, Input,
    Main, Menu, MenuItem, Message, MessageBox,
    Option,
    Pagination, Popover, Popconfirm, Progress,
    Row,
    Select, Submenu, Switch,
    Table, TableColumn, TabPane, Tabs, Tag, Tooltip
} from 'element-ui'

Vue.use(Alert)
Vue.use(Aside)

Vue.use(Button)

Vue.use(Card)
Vue.use(Col)
Vue.use(Container)

Vue.use(DatePicker)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)

Vue.use(Icon)
Vue.use(Input)

Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)

Vue.use(Option)

Vue.use(Row)

Vue.use(Pagination)
Vue.use(Popover)
Vue.use(Popconfirm)
Vue.use(Progress)

Vue.use(Select)
Vue.use(Submenu)
Vue.use(Switch)

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Tag)
Vue.use(Tooltip)

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message

import { locale as vueLocale } from '../common/vue-i18n'
import locale from 'element-ui/lib/locale'
import enLang from 'element-ui/lib/locale/lang/en'
import zhLang from 'element-ui/lib/locale/lang/zh-CN'
if (vueLocale === 'en') {
    locale.use(enLang)
} else if (vueLocale === 'zh_CN') {
    locale.use(zhLang)
}
