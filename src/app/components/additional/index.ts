import { ElTabPane, ElTabs } from "element-plus"
import { defineComponent, h } from "vue"
import { t } from "../../locale"
import Whitelist from './whitelist'
import DomainMerge from './domain-merge'
import './style'
import { renderContentContainer } from "../common/content-container"


const settingTabs = () => h(ElTabs,
    {},
    () => [
        h(ElTabPane, { label: t(msg => msg.additional.whitelist.label) }, () => h(Whitelist)),
        h(ElTabPane, { label: t(msg => msg.additional.merge.label) }, () => h(DomainMerge))
    ]
)
export default defineComponent(() => renderContentContainer(() => [settingTabs()]))