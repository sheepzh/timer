import Flex from "@pages/components/Flex"
import { sum } from "@util/array"
import { period2Str } from "@util/limit"
import { ElTag } from "element-plus"
import { computed, defineComponent, toRefs } from "vue"
import { useItem } from "./context"

type Arc = {
    start: number
    end: number
    delta: number
}

type ClockProps = {
    arcs?: Arc[]
    label?: string
}

const periodPath = (arc: Arc, r: number, center: [cx: number, cy: number]): string => {
    const { start, end, delta } = arc
    const [cx, cy] = center
    const x1 = Math.sin(start) * r + cx
    const y1 = cy - Math.cos(start) * r
    const x2 = Math.sin(end) * r + cx
    const y2 = cy - Math.cos(end) * r

    return `M${x1} ${y1}A${r} ${r} 0 ${delta > 360 ? 1 : 0} 1 ${x2} ${y2} `
}

const Clock = defineComponent((props: ClockProps) => {
    const r = 180
    const cx = 250
    const cy = 250
    const sw = 30
    const { arcs, label } = toRefs(props)
    const time = computed(() => {
        const val = sum(arcs?.value?.map(a => a.delta) ?? [])
        if (!val) return '0 min'
        if (val < 60) return `${val} min`
        const h = Math.floor(val / 60)
        const m = val - h * 60
        return `${h} h ${m} m`
    })

    return () => (
        <Flex flex={1} height="100%" justify="center">
            <svg viewBox="0 0 500 500" height={160} fill="transparent">
                <g>
                    <circle
                        stroke="var(--el-border-color-lighter)"
                        stroke-width={sw} cx={cx} cy={cy} r={r}
                    />
                    {arcs?.value?.map(arc => (arc.delta === 720
                        ? (
                            <circle
                                stroke="var(--el-color-primary)"
                                stroke-width={sw} cx={cx} cy={cy} r={r}
                            />
                        ) : (
                            <path
                                stroke="var(--el-color-primary)"
                                stroke- width={sw}
                                stroke-linecap="round"
                                d={periodPath(arc, r, [cx, cy])}
                            />
                        )
                    ))}
                </g>
                <text
                    x={cx} y={cy - 40}
                    width={r * 2} height={40} font-size={40}
                    fill="var(--el-text-color-primary)"
                    text-anchor="middle" alignment-baseline="central"
                >
                    {label?.value}
                </text>
                <text
                    x={cx} y={cy + 25}
                    width={r * 2} height={40} font-size={40}
                    fill="var(--el-text-color-primary)"
                    text-anchor="middle" alignment-baseline="central"
                >
                    {time.value}
                </text>
            </svg>
        </Flex>
    )
}, { props: ['arcs', 'label'] })

const ANGLE_PER_PERIOD = Math.PI * 2 / 720

const computedPeriodArcs = (periods: timer.limit.Item['periods']): { am?: Arc[], pm?: Arc[] } => {
    if (!periods?.length) return {}
    const am: Arc[] = []
    const pm: Arc[] = []
    periods.forEach(([start, end]) => {
        if (start >= 720) {
            // pm
            pm.push({
                start: (start - 720) * ANGLE_PER_PERIOD,
                end: (end + 1 - 720) * ANGLE_PER_PERIOD,
                delta: end + 1 - start,
            })
        } else if (end < 720) {
            // am
            const delta = end - start
            am.push({
                start: start * ANGLE_PER_PERIOD,
                end: (end + 1) * ANGLE_PER_PERIOD,
                delta: end + 1 - start,
            })
        } else {
            // both
            am.push({
                start: start * ANGLE_PER_PERIOD,
                end: Math.PI * 2,
                delta: 720 - start,
            })
            pm.push({
                start: 0,
                end: (end + 1 - 720) * ANGLE_PER_PERIOD,
                delta: end + 1 - 720,
            })
        }
    })
    return { am, pm }
}

const Period = defineComponent(() => {
    const { periods } = useItem()
    const arcProps = computed(() => computedPeriodArcs(periods))

    return () => (
        <Flex width="100%" height="100%" direction="column">
            <Flex gap={4} justify="center">
                {periods?.map(p => <ElTag size="small" type="primary">{period2Str(p)}</ElTag>)}
            </Flex>
            <Flex flex={1} justify="center" gap={10}>
                <Flex>
                    <Clock label="AM" arcs={arcProps.value.am} />
                </Flex>
                <Flex>
                    <Clock label="PM" arcs={arcProps.value.pm} />
                </Flex>
            </Flex>
        </Flex>
    )
})

export default Period