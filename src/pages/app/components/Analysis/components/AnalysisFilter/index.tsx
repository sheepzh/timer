/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import TimeFormatFilterItem from "@app/components/common/filter/TimeFormatFilterItem"
import { useState } from "@hooks"
import Flex from "@pages/components/Flex"
import { defineComponent, type PropType, watch } from "vue"
import type { AnalysisTarget } from "../../types"
import TargetSelect from "./TargetSelect"

const AnalysisFilter = defineComponent({
    props: {
        target: Object as PropType<AnalysisTarget>,
        timeFormat: String as PropType<timer.app.TimeFormat>
    },
    emits: {
        targetChange: (_target: AnalysisTarget) => true,
        timeFormatChange: (_format: timer.app.TimeFormat) => true,
    },
    setup(props, ctx) {
        const [target, setTarget] = useState(props.target)
        const [timeFormat, setTimeFormat] = useState(props.timeFormat)
        watch(target, () => ctx.emit('targetChange', target.value))
        watch(timeFormat, () => ctx.emit('timeFormatChange', timeFormat.value))

        return () => (
            <Flex gap={10}>
                <TargetSelect modelValue={target.value} onChange={setTarget} />
                <TimeFormatFilterItem
                    defaultValue={timeFormat.value}
                    onChange={setTimeFormat}
                />
            </Flex>
        )
    }
})

export default AnalysisFilter