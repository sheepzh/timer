import { InfoFilled } from "@element-plus/icons-vue"
import { ElIcon, ElTooltip } from "element-plus"
import { defineComponent, useSlots } from "vue"

const _default = defineComponent(() => {
    const { default: content } = useSlots()
    return () => content ? (
        <ElTooltip v-slots={{ content }}>
            <ElIcon size={15}>
                <InfoFilled />
            </ElIcon>
        </ElTooltip>
    ) : null
})

export default _default