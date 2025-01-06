import TooltipWrapper from "@app/components/common/TooltipWrapper"
import { t } from "@app/locale"
import { formatPeriodCommon } from "@util/time"
import { ElTag } from "element-plus"
import { defineComponent } from "vue"

const Waste = defineComponent({
    props: {
        value: Number,
        delayCount: Number,
        showPopover: Boolean,
    },
    setup(props) {
        return () => (
            <TooltipWrapper
                trigger="hover"
                showPopover={props.showPopover}
                placement="top"
                v-slots={{
                    content: () => `${t(msg => msg.limit.item.delayCount)}: ${props.delayCount ?? 0}`,
                    default: () => (
                        <ElTag size="small" type={props.value ? 'warning' : 'info'}>
                            {formatPeriodCommon(props.value)}
                        </ElTag>
                    ),
                }}
            />
        )
    },
})

export default Waste