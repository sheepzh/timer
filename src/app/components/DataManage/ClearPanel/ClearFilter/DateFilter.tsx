/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import I18nNode from "@app/components/common/I18nNode"
import { t } from "@app/locale"
import { EL_DATE_FORMAT } from "@i18n/element"
import { ElementDatePickerShortcut } from "@src/element-ui/date"
import { formatTime, getBirthday, MILL_PER_DAY } from "@util/time"
import { DateModelType, ElDatePicker } from "element-plus"
import { defineComponent, PropType } from "vue"

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

// The birthday of browser
const startPlaceholder = t(msg => msg.calendar.dateFormat, { y: '1994', m: '12', d: '15' })
const endPlaceholder = formatTime(yesterday, t(msg => msg.calendar.dateFormat))

const _default = defineComponent({
    emits: {
        change: (_date: [DateModelType, DateModelType]) => true
    },
    props: {
        dateRange: Object as PropType<[DateModelType, DateModelType]>
    },
    setup(props, ctx) {
        return () => (
            <p key="foobar">
                <a class="step-no">1.</a>
                <I18nNode
                    path={msg => msg.dataManage.filterDate}
                    param={{
                        picker: <ElDatePicker
                            modelValue={props.dateRange}
                            onUpdate:modelValue={date => ctx.emit("change", date)}
                            size="small"
                            style={{ width: "250px" }}
                            startPlaceholder={startPlaceholder}
                            endPlaceholder={endPlaceholder}
                            dateFormat={EL_DATE_FORMAT}
                            type="daterange"
                            disabledDate={(date: Date) => date.getTime() > yesterday}
                            shortcuts={pickerShortcuts}
                            rangeSeparator="-"
                        />
                    }}
                />
            </p>
        )
    }
})

export default _default
