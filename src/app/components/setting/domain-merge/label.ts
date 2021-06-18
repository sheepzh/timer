import { ElAlert } from "element-plus"
import { t } from "../../../locale"
import { h } from 'vue'

const labels = () => h(ElAlert,
    { type: 'info', title: t(msg => msg.setting.merge.infoAlertTitle) },
    () => [
        h('li', t(msg => msg.setting.merge.infoAlert0)),
        h('li', t(msg => msg.setting.merge.infoAlert1)),
        h('li', t(msg => msg.setting.merge.infoAlert2)),
        h('li', t(msg => msg.setting.merge.infoAlert3)),
        h('li', t(msg => msg.setting.merge.infoAlert4)),
        h('li', t(msg => msg.setting.merge.infoAlert5))
    ]
)

export default labels