import { ElCard } from "element-plus"
import { defineComponent, h } from "vue"
import ContentContainer from "../common/content-container"
import HelpUsAlertInfo from "./alert-info"
import HelpUsToolbar from "./toolbar"
import HelpUsProgressList from "./progress-list"
import "./style"

const _default = defineComponent({
    name: "HelpUs",
    render: () => h(ContentContainer, () => h(ElCard,
        { class: 'help-us' },
        () => [
            h(HelpUsAlertInfo),
            h(HelpUsToolbar),
            h(HelpUsProgressList),
        ])
    ),
})

export default _default