import { ElAlert } from "element-plus"
import { t } from "../../locale"
import { h } from "vue"
import { MergeRuleMessage } from "../../locale/components/merge-rule"

const liKeys: (keyof MergeRuleMessage)[] = ['infoAlert0', 'infoAlert1', 'infoAlert2', 'infoAlert3', 'infoAlert4', 'infoAlert5']

const alertInfo = () => h(ElAlert,
    { type: 'info', title: t(msg => msg.mergeRule.infoAlertTitle) },
    () => liKeys.map(key => h('li', t(msg => msg.mergeRule[key])))
)

export default alertInfo