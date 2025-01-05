/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Check, Close, Plus } from "@element-plus/icons-vue"
import { useShadow, useState, useSwitch } from "@hooks"
import { checkImpact, dateMinute2Idx, mergePeriod, period2Str } from "@util/limit"
import { MILL_PER_HOUR } from "@util/time"
import { ElButton, ElTag, ElTimePicker } from "element-plus"
import { type PropType, defineComponent, watch } from "vue"

const range2Period = (range: [Date, Date]): [number, number] => {
    const [start, end] = range || []
    if (start === undefined || end === undefined) return undefined
    const startIdx = dateMinute2Idx(start)
    const endIdx = dateMinute2Idx(end)
    return [Math.min(startIdx, endIdx), Math.max(startIdx, endIdx)]
}

const insertPeriods = (periods: timer.limit.Period[], toInsert: timer.limit.Period) => {
    if (!toInsert || !periods) return
    let len = periods.length
    if (!len) {
        periods.push(toInsert)
        return
    }
    for (let i = 0; i < len; i++) {
        const pre = periods[i]
        const next = periods[i + 1]
        if (checkImpact(pre, toInsert)) {
            mergePeriod(pre, toInsert)
            if (checkImpact(pre, next)) {
                mergePeriod(pre, next)
                periods.splice(i + 1, 1)
            }
            return
        }
        if (checkImpact(toInsert, next)) {
            mergePeriod(next, toInsert)
            return
        }
    }
    // Append
    periods.push(toInsert)
    periods.sort((a, b) => a[0] - b[0])
}

const _default = defineComponent({
    props: {
        modelValue: Array as PropType<timer.limit.Period[]>
    },
    emits: {
        change: (_periods: timer.limit.Period[]) => true,
    },
    setup(props, ctx) {
        const [periods, setPeriods] = useShadow(() => props.modelValue, [])
        watch(periods, () => ctx.emit("change", periods.value))
        const [editing, openEditing, closeEditing] = useSwitch(false)
        const [editingRange, setEditingRange] = useState<[Date, Date]>()

        const handleEdit = () => {
            openEditing()
            const now = new Date()
            setEditingRange([now, new Date(now.getTime() + MILL_PER_HOUR)])
        }

        const handleSave = () => {
            const val = range2Period(editingRange.value)
            const newPeriods = [...periods.value || []]
            insertPeriods(newPeriods, val)
            setPeriods(newPeriods)
            closeEditing()
        }

        return () => <div class="period-form-item-container">
            {periods.value?.map((p, idx, arr) =>
                <ElTag
                    size="small"
                    closable
                    onClose={() => setPeriods(arr.filter((_, i) => i !== idx))}
                >
                    {period2Str(p)}
                </ElTag>
            )}
            <div v-show={editing.value} class="limit-period-input">
                <ElTimePicker
                    modelValue={editingRange.value}
                    onUpdate:modelValue={setEditingRange}
                    popperClass="limit-period-time-picker-popper"
                    isRange
                    rangeSeparator="-"
                    format="HH:mm"
                    clearable={false}
                />
                <ElButton icon={<Close />} onClick={closeEditing} />
                <ElButton icon={<Check />} onClick={handleSave} />
            </div>
            <ElButton v-show={!editing.value} icon={<Plus />} size="small" onClick={handleEdit}>
                {t(msg => msg.button.create)}
            </ElButton>
        </div>
    }
})

export default _default