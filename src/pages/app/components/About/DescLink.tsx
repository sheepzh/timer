import { ElLink } from "element-plus"
import { defineComponent, h, useSlots, type PropType } from "vue"
import "./desc-link.sass"

export type Icon = "github" | "element-plus" | "echarts" | "vue"

const _default = defineComponent({
    props: {
        href: String,
        icon: String as PropType<Icon>
    },
    setup(props) {
        const { icon, href } = props
        const { default: default_ } = useSlots()
        return () => (
            <ElLink href={href} target="_blank">
                {icon ? <div class={`i-about-icon i-about-icons-${icon}`} /> : null}
                {!!default_ && h(default_)}
            </ElLink>
        )
    }
})

export default _default