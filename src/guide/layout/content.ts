
import { ElDivider } from "element-plus"
import { watch, defineComponent, h, onMounted } from "vue"
import Profile from "../component/profile"
import Usage from "../component/usage"
import Privacy from "../component/privacy"

function scrolePosition(position: string) {
    document.querySelector(`.archor-${position}`)?.scrollIntoView?.()
}

const _default = defineComponent({
    name: 'GuideContent',
    props: {
        position: {
            type: String,
            required: false,
        }
    },
    setup(props) {
        onMounted(() => scrolePosition(props.position))
        watch(() => props.position, newVal => newVal && scrolePosition(newVal))
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