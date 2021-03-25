import Vue from 'vue'
import {
    Alert, Aside,
    Button,
    Container,
    DatePicker, Dropdown, DropdownMenu, DropdownItem,
    Icon, Input,
    Main, Menu, MenuItem, Message, MessageBox,
    Option,
    Pagination, Popconfirm,
    Select, Submenu, Switch,
    Table, TableColumn, TabPane, Tabs, Tag
} from 'element-ui'

Vue.use(Alert)
import 'element-ui/lib/theme-chalk/alert.css'

Vue.use(Aside)
import 'element-ui/lib/theme-chalk/aside.css'

Vue.use(Button)
import 'element-ui/lib/theme-chalk/button.css'

Vue.use(Container)
import 'element-ui/lib/theme-chalk/container.css'

Vue.use(DatePicker)
import 'element-ui/lib/theme-chalk/date-picker.css'

Vue.use(Dropdown)
import 'element-ui/lib/theme-chalk/dropdown.css'

Vue.use(DropdownMenu)
import 'element-ui/lib/theme-chalk/dropdown-menu.css'

Vue.use(DropdownItem)
import 'element-ui/lib/theme-chalk/dropdown-item.css'

Vue.use(Icon)
import 'element-ui/lib/theme-chalk/icon.css'

Vue.use(Input)
import 'element-ui/lib/theme-chalk/input.css'

Vue.use(Main)
import 'element-ui/lib/theme-chalk/main.css'

Vue.use(Menu)
import 'element-ui/lib/theme-chalk/menu.css'

Vue.use(MenuItem)
import 'element-ui/lib/theme-chalk/menu-item.css'

Vue.use(Option)
import 'element-ui/lib/theme-chalk/option.css'

Vue.use(Pagination)
import 'element-ui/lib/theme-chalk/pagination.css'
Vue.use(Popconfirm)
import 'element-ui/lib/theme-chalk/popconfirm.css'
import 'element-ui/lib/theme-chalk/popover.css'

Vue.use(Select)
import 'element-ui/lib/theme-chalk/select.css'
Vue.use(Submenu)
import 'element-ui/lib/theme-chalk/submenu.css'
Vue.use(Switch)
import 'element-ui/lib/theme-chalk/switch.css'

Vue.use(Table)
import 'element-ui/lib/theme-chalk/table.css'
Vue.use(TableColumn)
import 'element-ui/lib/theme-chalk/table-column.css'

Vue.use(TabPane)
import 'element-ui/lib/theme-chalk/tab-pane.css'
Vue.use(Tabs)
import 'element-ui/lib/theme-chalk/tabs.css'

Vue.use(Tag)
import 'element-ui/lib/theme-chalk/tag.css'

Vue.prototype.$confirm = MessageBox.confirm
import 'element-ui/lib/theme-chalk/message-box.css'

Vue.prototype.$message = Message
import 'element-ui/lib/theme-chalk/message.css'

import { locale as vueLocale } from '../common/vue-i18n'
import locale from 'element-ui/lib/locale'
import enLang from 'element-ui/lib/locale/lang/en'
import zhLang from 'element-ui/lib/locale/lang/zh-CN'
if (vueLocale === 'en') {
    locale.use(enLang)
} else if (vueLocale === 'zh_CN') {
    locale.use(zhLang)
}
