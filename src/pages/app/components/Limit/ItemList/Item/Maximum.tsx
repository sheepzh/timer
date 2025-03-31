import { t } from "@app/locale"
import Flex from "@pages/components/Flex"
import { formatPeriodCommon } from "@util/time"
import { ElProgress, ElTag, ElText, type ProgressInstance, useNamespace, type UseNamespaceReturn } from "element-plus"
import { computed, defineComponent, onMounted, ref, type StyleValue, toRefs } from "vue"
import { useItem } from "./context"

type DoubleProgressProps = {
    visitMax?: number
    visit?: number
    timeMax?: number
    time?: number
    label: string
}

const computePercentage = (val: number | undefined, max: number | undefined): number => {
    if (!max) return 0
    return (val ?? 0) / max * 100
}

const percentageFormat = (val: number): string => val.toFixed(1) + '%'

const initVisitStyle = (visit: ProgressInstance | undefined, ns: UseNamespaceReturn): void => {
    const el = visit?.$el
    if (!el) return
    const inner = (el as HTMLDivElement).querySelector(`.${ns.be('bar', 'inner')}`)
    if (!inner) return
    const innerEl = inner as HTMLDivElement
    innerEl.style.left = 'unset'
    innerEl.style.right = '0px'

    const txt = (el as HTMLDivElement).querySelector(`.${ns.e('text')}`)
    if (!txt) return
    const txtEl = txt as HTMLDivElement
    txtEl.style.marginLeft = '0px'
    txtEl.style.marginInlineEnd = '3px'
}

const initTimeStyle = (time: ProgressInstance | undefined, ns: UseNamespaceReturn): void => {
    const el = time?.$el
    if (!el) return
    const txt = (el as HTMLDivElement).querySelector(`.${ns.e('text')}`)
    if (!txt) return
    const txtEl = txt as HTMLDivElement
    txtEl.style.marginLeft = '0px'
    txtEl.style.marginInlineStart = '3px'
    txtEl.style.textAlign = 'end'
}

const DoubleProgress = defineComponent((props: DoubleProgressProps) => {
    const { visit, visitMax, time, timeMax, label } = toRefs(props)

    const visitNode = ref<ProgressInstance>()
    const timeNode = ref<ProgressInstance>()
    const ns = useNamespace('progress')

    onMounted(() => {
        initVisitStyle(visitNode.value, ns)
        initTimeStyle(timeNode.value, ns)
    })

    const visitPercentage = computed(() => computePercentage(visit?.value, visitMax?.value))
    const timePercentage = computed(() => computePercentage(time?.value, timeMax?.value))

    return () => (
        <Flex direction="column" gap={5}>
            <Flex justify="space-between" style={{ position: 'relative' }}>
                <ElText style={{ position: 'absolute', top: 0, width: '100%', textAlign: 'center' } satisfies StyleValue}>
                    {label.value}
                </ElText>
                <ElText>{visitMax?.value || Infinity} {t(msg => msg.limit.item.visits)}</ElText>
                <ElText>{timeMax?.value ? formatPeriodCommon(timeMax.value * 1000) : `${Infinity} s`}</ElText>
            </Flex>
            <Flex gap={10} width='100%'>
                <Flex flex={1}>
                    <ElProgress
                        ref={visitNode}
                        strokeWidth={15}
                        percentage={visitPercentage.value}
                        format={percentageFormat}
                        style={{ width: '100%', flexDirection: 'row-reverse' } satisfies StyleValue}
                    />
                </Flex>
                <Flex flex={1}>
                    <ElProgress
                        ref={timeNode}
                        strokeWidth={15}
                        percentage={timePercentage.value}
                        format={percentageFormat}
                        style={{ width: '100%' } satisfies StyleValue}
                    />
                </Flex>
            </Flex>
        </Flex>
    )
}, { props: ['visit', 'visitMax', 'time', 'timeMax', 'label'] })

const Maximum = defineComponent(() => {
    const data = useItem()

    return () => (
        <Flex
            direction="column"
            width="100%"
            height="100%"
            justify="space-between"
            padding="0px 15px"
        >
            <Flex justify="center" align="center" gap={10}>
                <ElText>{t(msg => msg.limit.item.visitTime)}</ElText>
                <ElTag type={data.visitTime ? 'primary' : 'info'} size="small">
                    {data.visitTime ? formatPeriodCommon(data.visitTime) : Infinity} s
                </ElTag>
            </Flex>
            <DoubleProgress
                label={t(msg => msg.limit.item.daily)}
                visitMax={data.count} visit={data.visit}
                timeMax={data.time} time={data.waste / 1000}
            />
            <DoubleProgress
                label={t(msg => msg.limit.item.weekly)}
                visitMax={data.weeklyCount} visit={data.weeklyVisit}
                timeMax={data.weekly} time={data.weeklyWaste / 1000}
            />
        </Flex>
    )
})

export default Maximum