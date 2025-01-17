import { useState } from "@hooks/useState"
import { ElTooltip, type Placement, type PopperEffect, type PopperTrigger } from "element-plus"
import { defineComponent, toRef, type PropType } from "vue"

const TooltipWrapper = defineComponent({
    props: {
        usePopover: Boolean,
        placement: String as PropType<Placement>,
        effect: String as PropType<PopperEffect>,
        trigger: String as PropType<PopperTrigger>,
        offset: Number,
    },
    setup(props, ctx) {
        const [visible, setVisible] = useState(false)
        const usePopover = toRef(props, 'usePopover')

        return () => (
            <ElTooltip
                visible={!!usePopover.value && visible.value}
                onUpdate:visible={setVisible}
                placement={props.placement}
                effect={props.effect}
                offset={props.offset}
                trigger={props.trigger}
                v-slots={ctx.slots}
            />
        )
    }
})

export default TooltipWrapper