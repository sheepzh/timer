import { t } from "@app/locale"
import Flex from "@pages/components/Flex"
import { period2Str } from "@util/limit"
import { formatPeriod, MILL_PER_SECOND } from "@util/time"
import { ElTag } from "element-plus"
import { defineComponent, toRef, type PropType } from "vue"


const TIME_FORMAT = {
    hourMsg: '{hour}h{minute}m{second}s',
    minuteMsg: '{minute}m{second}s',
    secondMsg: '{second}s',
}

const RuleContent = defineComponent({
    props: {
        value: Object as PropType<timer.limit.Item>
    },
    setup(props, ctx) {
        const row = toRef(props, 'value')

        return () => (
            <Flex direction="column" gap={4}>
                {!!row.value?.time && (
                    <div>
                        <ElTag size="small">
                            {t(msg => msg.limit.item.time)}: {formatPeriod(row.value?.time * MILL_PER_SECOND, TIME_FORMAT)}
                        </ElTag>
                    </div>
                )}
                {!!row.value?.weekly && (
                    <div>
                        <ElTag size="small">
                            {t(msg => msg.limit.item.weekly)}: {formatPeriod(row.value?.weekly * MILL_PER_SECOND, TIME_FORMAT)}
                        </ElTag>
                    </div>
                )}
                {!!row.value?.visitTime && (
                    <div>
                        <ElTag size="small">
                            {t(msg => msg.limit.item.visitTime)}: {formatPeriod(row.value?.visitTime * MILL_PER_SECOND, TIME_FORMAT)}
                        </ElTag>
                    </div>
                )}
                {!!row.value?.periods?.length && <>
                    <div>
                        <ElTag size="small" type="info">{t(msg => msg.limit.item.period)}</ElTag>
                    </div>
                    <Flex justify="center" gap={4} wrap="wrap">
                        {row.value?.periods.map(p => <ElTag size="small" type="info">{period2Str(p)}</ElTag>)}
                    </Flex>
                </>}
            </Flex>
        )
    },
})

export default RuleContent