/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElAlert } from "element-plus"
import { t } from "../../locale"
import { h } from "vue"
import { SiteManageMessage } from "../../../app/locale/components/site-manage"

const liKeys: (keyof SiteManageMessage)[] = ['infoAlert0', 'infoAlert1', 'infoAlert2', 'infoAlert3']

const alertInfo = () => h(ElAlert,
    { type: 'info', title: t(msg => msg.siteManage.infoAlertTitle) },
    () => liKeys.map(key => h('li', t(msg => msg.siteManage[key])))
)

export default alertInfo