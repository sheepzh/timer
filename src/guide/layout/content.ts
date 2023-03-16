
import { ElDivider } from "element-plus"
import { watch, defineComponent, h, onMounted, PropType } from "vue"
import Profile from "../component/profile"
import Usage from "../component/usage"
import Privacy from "../component/privacy"
import { position2AnchorClz } from "@guide/util"

function scrollPosition(position: Position) {
    document.querySelector(`.${position2AnchorClz(position)}`)?.scrollIntoView?.()
}

const _default = defineComponent({
    name: 'GuideContent',
    props: {
        position: {
            type: String as PropType<Position>,
            required: false,
        }
    },
    setup(props) {
        onMounted(() => scrollPosition(props.position))
        watch(() => props.position, newVal => newVal && scrollPosition(newVal))
        return () => [
            h(Profile),
            h(ElDivider),
            h(Usage),
            h(ElDivider),
            h(Privacy),
        ]
    }
})

export default _default