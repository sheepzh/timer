import { useShadow } from "@hooks"
import { ElTooltip, type Placement, type PopperEffect, type PopperTrigger } from "element-plus"
import { defineComponent, h, PropType } from "vue"

const _default = defineComponent({
    props: {
        showPopover: Boolean,
        placement: String as PropType<Placement>,
        effect: String as PropType<PopperEffect>,
        trigger: String as PropType<PopperTrigger>,
        offset: Number,
    },
    setup(props, ctx) {

        const [show] = useShadow(() => props.showPopover)

        return () => {
            if (!show.value) return h(ctx.slots?.default)
            return (
                <ElTooltip
                    placement={props.placement}
                    effect={props.effect}
                    offset={props.offset}
                    trigger={props.trigger}
                    v-slots={ctx.slots}
                />
            )
        }
    }
})

export default _default