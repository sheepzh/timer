/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { PropType, defineComponent, h, ref } from "vue"
import SelectFilterItem from "./select-filter-item"
import { t } from "@app/locale"

const TIME_FORMAT_LABELS: { [key in timer.app.TimeFormat]: string } = {
    default: t(msg => msg.timeFormat.default),
    second: t(msg => msg.timeFormat.second),
    minute: t(msg => msg.timeFormat.minute),
    hour: t(msg => msg.timeFormat.hour)
}

const _default = defineComponent({
    emits: {
        change: (_: timer.app.TimeFormat) => true
    },
    props: {
        defaultValue: String as PropType<timer.app.TimeFormat>
    },
    setup: ({ defaultValue }, ctx) => {
        const timeFormat = ref(defaultValue || 'default')

        return () => h(SelectFilterItem, {
            historyName: 'timeFormat',
            defaultValue: timeFormat.value,
            options: TIME_FORMAT_LABELS,
            onSelect: (newVal: timer.app.TimeFormat) => ctx.emit('change', timeFormat.value = newVal)
        })
    }
})

export default _default