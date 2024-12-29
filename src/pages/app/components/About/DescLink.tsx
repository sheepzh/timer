import { ElLink } from "element-plus"
import { defineComponent, h, PropType } from "vue"
import "./desc-link.sass"

export type Icon = "github" | "element-plus" | "echarts" | "vue"

const _default = defineComponent({
    props: {
        href: String,
        icon: String as PropType<Icon>
    },
    setup(props, ctx) {
        const { icon, href } = props
        return () => (
            <ElLink href={href} target="_blank">
                {icon ? <div class={`i-about-icon i-about-icons-${icon}`} /> : null}
                {h(ctx.slots.default)}
            </ElLink>
        )
    }
})

export default _default