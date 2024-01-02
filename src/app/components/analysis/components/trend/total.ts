/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { RingValue } from "@app/components/analysis/util"
import type { PropType } from "vue"
import type { I18nKey } from "@app/locale"
import type { IndicatorProps } from "@app/components/common/kanban/indicator-cell"

import { defineComponent, h } from "vue"
import { KanbanIndicatorCell } from "@app/components/common/kanban"
import { t } from "@app/locale"
import { periodFormatter } from "@app/util/time"
import { computeRingText } from "@app/components/analysis/util"

type Props = {
    activeDay: RingValue
    rangeLength: number
    visit: RingValue
    focus: RingValue
    timeFormat: timer.app.TimeFormat
}

const DAY_LABEL = `${t(msg => msg.analysis.trend.activeDay)}/${t(msg => msg.analysis.trend.totalDay)}`
const VISIT_LABEL = t(msg => msg.analysis.common.visitTotal)
const FOCUS_LABEL = t(msg => msg.analysis.common.focusTotal)
const RING_TIP: I18nKey = msg => msg.analysis.common.ringGrowth

const computeDayValue = (props: Props) => {
    const { activeDay, rangeLength } = props
    const thisActiveDay = activeDay?.[0]
    return `${thisActiveDay?.toString() || '-'}/${rangeLength?.toString() || '-'}`
}

const renderIndicator = (props: IndicatorProps) => h('div', h(KanbanIndicatorCell, props))

const computeFocusText = (focusRing: RingValue, format: timer.app.TimeFormat) => {
    const current = focusRing?.[0]
    return current === undefined ? '-' : periodFormatter(current, format)
}

const _default = defineComponent({
    props: {
        activeDay: [Object, Object] as PropType<RingValue>,
        rangeLength: Number,
        visit: [Object, Object] as PropType<RingValue>,
        focus: [Object, Object] as PropType<RingValue>,
        timeFormat: String as PropType<timer.app.TimeFormat>
    },
    setup(props) {
        return () => h('div', { class: 'analysis-trend-total-container' }, [
            renderIndicator({
                mainName: DAY_LABEL,
                mainValue: computeDayValue(props),
                subTips: RING_TIP,
                subValue: computeRingText(props.activeDay)
            }),
            renderIndicator({
                mainName: FOCUS_LABEL,
                mainValue: computeFocusText(props.focus, props.timeFormat),
                subTips: RING_TIP,
                subValue: computeRingText(props.focus, delta => periodFormatter(delta, props.timeFormat))
            }),
            renderIndicator({
                mainName: VISIT_LABEL,
                mainValue: props.visit?.[0]?.toString() || '-',
                subTips: RING_TIP,
                subValue: computeRingText(props.visit),
            }),
        ])
    }
})

export default _default