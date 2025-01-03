import { InfoFilled } from "@element-plus/icons-vue"
import { ElIcon, ElTooltip } from "element-plus"
import { defineComponent } from "vue"

const _default = defineComponent((_, ctx) => {
    return () => {
        const content = ctx.slots.default
        if (!content) {
            return null
        }
        return (
            <ElTooltip v-slots={{ content }}>
                <ElIcon size={15}>
                    <InfoFilled />
                </ElIcon>
            </ElTooltip>
        )
    }
})

export default _default