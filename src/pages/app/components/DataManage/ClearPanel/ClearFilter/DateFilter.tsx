/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import I18nNode from "@app/components/common/I18nNode"
import { t } from "@app/locale"
import { dateFormat as elDateFormat } from "@i18n/element"
import { type ElementDatePickerShortcut } from "@pages/element-ui/date"
import { getDatePickerIconSlots } from "@pages/element-ui/rtl"
import { formatTime, getBirthday, MILL_PER_DAY } from "@util/time"
import { ElDatePicker } from "element-plus"
import { defineComponent, type StyleValue, type PropType } from "vue"

const _default = defineComponent({
    emits: {
        change: (_date: [Date, Date]) => true
    },
    props: {
        dateRange: Object as PropType<[Date, Date]>
    },
    setup(props, ctx) {
        const yesterday = new Date().getTime() - MILL_PER_DAY
        const daysBefore = (days: number) => new Date(new Date().getTime() - days * MILL_PER_DAY)

        const birthday = getBirthday()
        const pickerShortcuts: ElementDatePickerShortcut[] = [
            {
                text: t(msg => msg.calendar.range.tillYesterday),
                value: [birthday, daysBefore(1)],
            }, {
                text: t(msg => msg.calendar.range.tillDaysAgo, { n: 7 }),
                value: [birthday, daysBefore(7)],
            }, {
                text: t(msg => msg.calendar.range.tillDaysAgo, { n: 30 }),
                value: [birthday, daysBefore(30)],
            }
        ]
        const dateFormat = '{y}-{m}-{d}'
        const startPlaceholder = formatTime(birthday, dateFormat)
        const endPlaceholder = formatTime(yesterday, dateFormat)

        return () => (
            <p>
                <a style={{ marginRight: '10px' }}>1.</a>
                <I18nNode
                    path={msg => msg.dataManage.filterDate}
                    param={{
                        picker: <ElDatePicker
                            modelValue={props.dateRange}
                            onUpdate:modelValue={date => ctx.emit("change", date)}
                            size="small"
                            style={{ width: "250px" } satisfies StyleValue}
                            startPlaceholder={startPlaceholder}
                            endPlaceholder={endPlaceholder}
                            dateFormat={elDateFormat()}
                            type="daterange"
                            disabledDate={(date: Date) => date.getTime() > yesterday}
                            shortcuts={pickerShortcuts}
                            rangeSeparator="-"
                            v-slots={getDatePickerIconSlots()}
                        />
                    }}
                />
            </p>
        )
    }
})

export default _default
