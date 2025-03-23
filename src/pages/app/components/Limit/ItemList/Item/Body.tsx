import { defineComponent } from "vue"
import { useItem } from "./useItem"
import Flex from "@pages/components/Flex"
import { ElDescriptions, ElDescriptionsItem } from "element-plus"
import Weekday from "../../LimitTable/Weekday"
import { t } from "@app/locale"

const Body = defineComponent({
    setup() {
        const { data } = useItem()

        return () => (
            <Flex flex={1} padding="0 20px 20px 20px" width="100%">
                <ElDescriptions>
                    <ElDescriptionsItem label={t(msg => msg.limit.item.effectiveDay)}>
                        <Weekday value={data.weekdays} />
                    </ElDescriptionsItem>
                </ElDescriptions>
            </Flex>
        )
    },
})

export default Body