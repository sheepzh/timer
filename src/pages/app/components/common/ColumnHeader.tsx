import { InfoFilled } from "@element-plus/icons-vue"
import { ElIcon, ElTooltip } from "element-plus"
import { defineComponent } from "vue"
import Flex from "../../../components/Flex"

const ColumnHeader = defineComponent({
    props: {
        label: String,
        tooltipContent: String,
    },
    setup(props, ctx) {
        return () => (
            <Flex justify="center" align="center" gap={4}>
                <span>
                    {props.label}
                </span>
                <ElTooltip
                    content={props.tooltipContent}
                    placement="top"
                    v-slots={{
                        content: ctx.slots.tooltipContent,
                        default: () => (
                            <Flex height='100%'>
                                <ElIcon>
                                    <InfoFilled />
                                </ElIcon>
                            </Flex>
                        ),
                    }}
                />
            </Flex>
        )
    }
})

export default ColumnHeader