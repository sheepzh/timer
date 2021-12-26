/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * The label info of whitelist
 *
 * @author zhy
 * @since 0.4.0
 */
import { h } from "vue"
import { ElAlert } from "element-plus"
import { t } from "@app/locale"
import { WhitelistMessage } from "@app/locale/components/whitelist"

const title = t(msg => msg.whitelist.infoAlertTitle)

const liKeys: (keyof WhitelistMessage)[] = ['infoAlert0', 'infoAlert1']
const generateList = () => liKeys.map(key => h('li', t(msg => msg.whitelist[key])))
const alertInfo = () => h(ElAlert,
    { type: 'info', title },
    generateList
)

export default alertInfo