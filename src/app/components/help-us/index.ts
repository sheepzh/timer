import { ElCard } from "element-plus"
import { defineComponent, h } from "vue"
import ContentContainer from "../common/content-container"
import AlertInfo from "./alert-info"
import Toolbar from "./toolbar"
import ProgressList from "./progress-list"
import MemberList from "./member-list"
import "./style"

const _default = defineComponent(() =>
    () => h(ContentContainer, () => h(ElCard,
        { class: 'help-us' },
        () => [
            h(AlertInfo),
            h(Toolbar),
            h(ProgressList),
            h(MemberList),
        ])
    )
)

export default _default