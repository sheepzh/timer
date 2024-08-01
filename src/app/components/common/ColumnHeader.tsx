import { InfoFilled } from "@element-plus/icons-vue"
import { ElIcon, ElTooltip } from "element-plus"
import { defineComponent } from "vue"

const ColumnHeader = defineComponent({
    props: {
        label: String,
        tooltipContent: String,
    },
    setup(props, ctx) {
        return () => (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                <span>
                    {props.label}
                </span>
                <ElTooltip
                    content={props.tooltipContent}
                    placement="top"
                    v-slots={{
                        content: ctx.slots.tooltipContent,
                        default: () => (
                            <div style={{ display: 'inline-flex' }}>
                                <ElIcon>
                                    <InfoFilled />
                                </ElIcon>
                            </div>
                        ),
                    }}>
                </ElTooltip>
            </div>
        )
    }
})

export default ColumnHeader