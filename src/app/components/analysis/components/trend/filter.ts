/**
 * Copyright (c) 2023 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ElementDatePickerShortcut } from "@src/element-ui/date"
import type { PropType, Ref } from "vue"

import { t } from "@app/locale"
import { AnalysisMessage } from "@i18n/message/app/analysis"
import { ElDatePicker } from "element-plus"
import { defineComponent, h, ref } from "vue"
import { daysAgo } from "@util/time"

function datePickerShortcut(msgKey: keyof AnalysisMessage['trend'], agoOfStart?: number, agoOfEnd?: number): ElementDatePickerShortcut {
    return {
        text: t(msg => msg.analysis.trend[msgKey]),
        value: daysAgo(agoOfStart - 1 || 0, agoOfEnd || 0)
    }
}

const SHORTCUTS = [
    datePickerShortcut('lastWeek', 7),
    datePickerShortcut('last15Days', 15),
    datePickerShortcut('last30Days', 30),
    datePickerShortcut("last90Days", 90)
]

const _default = defineComponent({
    props: {
        dateRange: [Object, Object] as PropType<[Date, Date]>
    },
    emits: {
        dateRangeChange: (_val: [Date, Date]) => true
    },
    setup(props, ctx) {
        const dateFormat = t(msg => msg.calendar.dateFormat, {
            y: 'YYYY',
            m: 'MM',
            d: 'DD'
        })
        const dateRange: Ref<[Date, Date]> = ref(props.dateRange)
        return () => h('div', { class: 'analysis-trend-filter' }, [
            h(ElDatePicker, {
                modelValue: dateRange.value,
                disabledDate: (date: Date) => date.getTime() > new Date().getTime(),
                format: dateFormat,
                type: 'daterange',
                shortcuts: SHORTCUTS,
                rangeSeparator: '-',
                clearable: false,
                'onUpdate:modelValue': (newVal: [Date, Date]) => ctx.emit("dateRangeChange", dateRange.value = newVal),
            })
        ])
    }
})

export default _default