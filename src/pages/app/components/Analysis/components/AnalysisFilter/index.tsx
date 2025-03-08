/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import TimeFormatFilterItem from "@app/components/common/filter/TimeFormatFilterItem"
import { useState } from "@hooks"
import Flex from "@pages/components/Flex"
import { defineComponent, type PropType, ref, VNode, VNodeRef, watch } from "vue"
import type { AnalysisTarget } from "../../types"
import TargetSelect from "./TargetSelect"
import { useNamespace } from "element-plus"

export type AnalysisFilterInstance = {
    openTargetSelect: () => void
}

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

        const targetSelect: VNodeRef = ref()
        const { is } = useNamespace('select')
        const openTargetSelect = () => {
            const targetEl = targetSelect.value?.$el as HTMLDivElement
            targetEl?.click?.()
            const input = targetEl?.querySelector('.el-select__input') as HTMLInputElement
            (targetEl?.querySelector('.el-select__wrapper') as HTMLElement)?.classList?.add?.(is('focused'))
            // input?.focus?.()
            input?.click?.()
        }

        ctx.expose({ openTargetSelect } satisfies AnalysisFilterInstance)

        return () => (
            <Flex gap={10}>
                <TargetSelect
                    ref={targetSelect}
                    modelValue={target.value}
                    onChange={setTarget}
                />
                <TimeFormatFilterItem
                    defaultValue={timeFormat.value}
                    onChange={setTimeFormat}
                />
            </Flex>
        )
    }
})

export default AnalysisFilter