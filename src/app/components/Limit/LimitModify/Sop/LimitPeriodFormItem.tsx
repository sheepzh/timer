/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Check, Close, Plus } from "@element-plus/icons-vue"
import { ElButton, ElFormItem, ElTag, ElTimePicker } from "element-plus"
import { PropType, defineComponent, reactive, ref } from "vue"
import { checkImpact, dateMinute2Idx, mergePeriod, period2Str } from "@util/limit"

const range2Period = (range: [Date, Date]): [number, number] => {
    const start = range?.[0]
    const end = range?.[1]
    if (start === undefined || end === undefined) {
        return undefined
    }
    const startIdx = dateMinute2Idx(start)
    const endIdx = dateMinute2Idx(end)
    return [Math.min(startIdx, endIdx), Math.max(startIdx, endIdx)]
}

const PeriodInput = defineComponent({
    emits: {
        close: () => true,
        save: (_p: timer.limit.Period) => true,
    },
    setup(_, ctx) {
        const range = ref<[Date, Date]>()
        const handleSave = () => {
            const val = range2Period(range.value)
            val && ctx.emit("save", val)
        }
        return () => (
            <div class="limit-period-input">
                <ElTimePicker
                    modelValue={range.value}
                    onUpdate:modelValue={val => range.value = val}
                    popperClass="limit-period-time-picker-popper"
                    isRange
                    rangeSeparator="-"
                    format="HH:mm"
                    clearable={false}
                />
                <ElButton icon={<Close />} onClick={() => ctx.emit("close")} />
                <ElButton icon={<Check />} onClick={handleSave} />
            </div>
        )
    }
})

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
    setup({ modelValue }) {
        const periods = reactive(modelValue || [])
        const periodEditing = ref(false)

        return () => (
            <ElFormItem label={t(msg => msg.limit.item.period)}>
                <div class="period-form-item-container">
                    {periods?.map((p, idx) =>
                        <ElTag
                            closable
                            size="small"
                            onClose={() => periods.splice(idx, 1)}
                        >
                            {period2Str(p)}
                        </ElTag>
                    )}
                    {periodEditing.value
                        ? <PeriodInput
                            onClose={() => periodEditing.value = false}
                            onSave={p => {
                                insertPeriods(periods, p)
                                periodEditing.value = false
                            }}
                        />
                        : <ElButton icon={<Plus />} size="small" onClick={() => periodEditing.value = true}>
                            {t(msg => msg.button.create)}
                        </ElButton>
                    }
                </div>
            </ElFormItem>
        )
    }
})

export default _default