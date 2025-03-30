import { t } from "@app/locale"
import { useState } from "@hooks"
import Box from "@pages/components/Box"
import Flex from "@pages/components/Flex"
import { formatPeriodCommon } from "@util/time"
import { ElProgress, ElSegmented, ElTag, ElText } from "element-plus"
import { computed, defineComponent, StyleValue, toRefs } from "vue"
import { useItem } from "./context"

type SegVal = "maximum" | 'periods'

type SegOption = { value: SegVal, label: string }

const computeInitialSeg = (item: timer.limit.Item): SegVal => {
    const { waste, visit, weeklyWaste, weeklyVisit, periods } = item
    if (waste || visit || weeklyWaste || weeklyVisit) {
        return 'maximum'
    } else if (periods?.length) {
        return 'periods'
    } else {
        // by default
        return 'maximum'
    }
}

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

const DoubleProgress = defineComponent((props: DoubleProgressProps) => {
    const { visit, visitMax, time, timeMax, label } = toRefs(props)

    const visitPercentage = computed(() => computePercentage(visit?.value, visitMax?.value))
    const timePercentage = computed(() => computePercentage(time?.value, timeMax?.value))
    return () => (
        <Flex direction="column" gap={5}>
            <Flex justify="space-between">
                <ElText>{visitMax?.value ?? 0} {t(msg => msg.limit.item.visits)}</ElText>
                {label.value}
                <ElText>{formatPeriodCommon((timeMax?.value ?? 0) * 1000)}</ElText>
            </Flex>
            <Flex gap={1} width='100%'>
                <Flex flex={1}>
                    <ElProgress
                        strokeWidth={20}
                        percentage={visitPercentage.value}
                        format={v => v.toFixed(1)}
                        style={{ width: '100%' } satisfies StyleValue}
                    />
                </Flex>
                <Flex flex={1}>
                    <ElProgress
                        strokeWidth={20}
                        percentage={timePercentage.value}
                        format={v => `${v.toFixed(1)}%`}
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
        >
            <Box textAlign="center">
                <ElText>{t(msg => msg.limit.item.visitTime)}</ElText>
                &emsp;
                <ElTag type={data.visitTime ? 'primary' : 'info'} size="small">
                    {formatPeriodCommon(data.visitTime ?? 0)}
                </ElTag>
            </Box>
            <DoubleProgress
                label={t(msg => msg.limit.item.daily)}
                visitMax={data.visit} visit={data.count}
                timeMax={data.time} time={data.waste / 1000}
            />
            <DoubleProgress
                label={t(msg => msg.limit.item.weekly)}
                visitMax={data.weeklyVisit} visit={data.weeklyCount}
                timeMax={data.weekly} time={data.weeklyWaste / 1000}
            />
        </Flex>
    )
})

const Body = defineComponent(() => {
    const data = useItem()
    const [seg, setSeg] = useState(computeInitialSeg(data))

    const options: SegOption[] = [
        {
            value: 'maximum',
            label: t(msg => msg.limit.item.maximum),
        }, {
            value: 'periods',
            label: t(msg => msg.limit.item.period),
        },
    ]

    return () => (
        <Flex
            flex={1}
            gap={20}
            padding="0 20px 20px 20px"
            width="100%"
            boxSizing="border-box"
            direction="column"
        >
            <Flex flex={1}>
                {seg.value === 'maximum' && <Maximum />}
            </Flex>
            <Box textAlign="center" height="fit-content" width="100%">
                <ElSegmented
                    modelValue={seg.value}
                    onChange={setSeg}
                    options={options}
                    size="small"
                />
            </Box>
        </Flex>
    )
})

export default Body