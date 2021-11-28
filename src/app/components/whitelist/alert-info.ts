/**
 * The label info of whitelist
 *
 * @author zhy
 * @since 0.4.0
 */
import { h } from "vue"
import { ElAlert } from "element-plus"
import { t } from "../../locale"
import { WhitelistMessage } from "../../locale/components/whitelist"

const liKeys: (keyof WhitelistMessage)[] = ['infoAlert0', 'infoAlert1']

const alertInfo = () => h(ElAlert,
    { type: 'info', title: t(msg => msg.whitelist.infoAlertTitle) },
    () => liKeys.map(key => h('li', t(msg => msg.whitelist[key])))
)

export default alertInfo