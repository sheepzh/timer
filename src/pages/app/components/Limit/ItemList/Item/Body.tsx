import { t } from "@app/locale"
import Flex from "@pages/components/Flex"
import { joinAny } from "@util/array"
import { ElDescriptions, ElDescriptionsItem, ElText } from "element-plus"
import { defineComponent, type StyleValue } from "vue"
import Weekday from "../../LimitTable/Weekday"
import { useItem } from "./useItem"

const Body = defineComponent(() => {
    const { data } = useItem()

    return () => (
        <Flex flex={1} padding="0 20px 20px 20px" width="100%" boxSizing="border-box">
            <ElDescriptions border size="small" style={{ flex: 1 } satisfies StyleValue}>
                <ElDescriptionsItem label={t(msg => msg.limit.item.condition)}>
                    <Flex align="center">
                        {joinAny(
                            data.cond.map(url => <ElText size="small">{url}</ElText>),
                            <br />,
                        )}
                    </Flex>
                </ElDescriptionsItem>
                <ElDescriptionsItem label={t(msg => msg.limit.item.effectiveDay)}>
                    <Weekday value={data.weekdays} />
                </ElDescriptionsItem>
            </ElDescriptions>
        </Flex>
    )
})

export default Body