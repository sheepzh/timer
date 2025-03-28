/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { useShadow } from "@hooks"
import { type PropType, defineComponent } from "vue"
import SelectFilterItem from "./SelectFilterItem"

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
    setup: (props, ctx) => {
        const [data] = useShadow(() => props.defaultValue, "default")
        return () => <SelectFilterItem
            historyName="timeFormat"
            defaultValue={data.value}
            options={TIME_FORMAT_LABELS}
            onSelect={val => ctx.emit("change", data.value = val as timer.app.TimeFormat)}
        />
    }
})

export default _default