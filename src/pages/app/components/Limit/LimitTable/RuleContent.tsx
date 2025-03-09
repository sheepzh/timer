import { t } from "@app/locale"
import Flex from "@pages/components/Flex"
import { period2Str } from "@util/limit"
import { formatPeriod, MILL_PER_SECOND } from "@util/time"
import { ElTag } from "element-plus"
import { computed, defineComponent, toRef, type PropType } from "vue"

const TIME_FORMAT = {
    dayMsg: '{day}d{hour}h{minute}m{second}s',
    hourMsg: '{hour}h{minute}m{second}s',
    minuteMsg: '{minute}m{second}s',
    secondMsg: '{second}s',
}

const TimeCountTag = defineComponent({
    props: {
        time: Number,
        count: Number,
        label: String,
    },
    setup(props) {
        const visible = computed(() => !!props.time || !!props.count)
        const content = computed(() => {
            const timeContent = props.time ? formatPeriod(props.time * MILL_PER_SECOND, TIME_FORMAT) : ''
            const countContent = props.count ? `${props.count} ${t(msg => msg.limit.item.visits)}` : ''
            return [timeContent, countContent].filter(str => !!str).join(` ${t(msg => msg.limit.item.or)} `)
        })

        return () => (
            <div v-show={visible.value}>
                <ElTag size="small">
                    {props.label}: {content.value}
                </ElTag>
            </div>
        )
    },
})

const RuleContent = defineComponent({
    props: {
        value: Object as PropType<timer.limit.Item>
    },
    setup(props) {
        const row = toRef(props, 'value')

        return () => (
            <Flex column gap={4}>
                <TimeCountTag
                    time={row.value?.time}
                    count={row.value?.count}
                    label={t(msg => msg.limit.item.daily)}
                />
                <TimeCountTag
                    time={row.value?.weekly}
                    count={row.value?.weeklyCount}
                    label={t(msg => msg.limit.item.weekly)}
                />
                {!!row.value?.visitTime && (
                    <div>
                        <ElTag size="small" type="danger">
                            {t(msg => msg.limit.item.visitTime)}: {formatPeriod(row.value?.visitTime * MILL_PER_SECOND, TIME_FORMAT)}
                        </ElTag>
                    </div>
                )}
                {!!row.value?.periods?.length && <>
                    <div>
                        <ElTag size="small" type="info">{t(msg => msg.limit.item.period)}</ElTag>
                    </div>
                    <Flex justify="center" gap={4} wrap="wrap">
                        {row.value?.periods?.map(p => <ElTag size="small" type="info">{period2Str(p)}</ElTag>)}
                    </Flex>
                </>}
            </Flex>
        )
    },
})

export default RuleContent