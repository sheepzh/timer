/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import SelectFilterItem from '@app/components/common/SelectFilterItem'
import SwitchFilterItem from '@app/components/common/SwitchFilterItem'
import { t } from '@app/locale'
import { HabitMessage } from '@i18n/message/app/habit'
import { PropType, defineComponent, ref, watch } from 'vue'

// [value, label]
type _SizeOption = [number, keyof HabitMessage['period']['sizes']]

function allOptions(): Record<number, string> {
    const allOptions = {}
    const allSizes: _SizeOption[] = [
        [1, 'fifteen'],
        [2, 'halfHour'],
        [4, 'hour'],
        [8, 'twoHour'],
    ]
    allSizes.forEach(
        ([size, msg]) => (allOptions[size] = t((root) => root.habit.period.sizes[msg]))
    )
    return allOptions
}

const AVERAGE_LABEL = t((msg) => msg.habit.period.averageLabel)

export type FilterOption = {
    periodSize: number
    average: boolean
}

const _default = defineComponent({
    props: {
        defaultValue: Object as PropType<FilterOption>,
    },
    emits: {
        change: (_newVal: FilterOption) => true,
    },
    setup(prop, ctx) {
        const periodSize = ref(prop.defaultValue?.periodSize || 1)
        const average = ref(prop.defaultValue?.average || false)
        watch([periodSize, average], () =>
            ctx.emit('change', {
                periodSize: periodSize.value,
                average: average.value,
            })
        )
        return () => <>
            <SelectFilterItem
                historyName='periodSize'
                defaultValue={periodSize.value?.toString?.()}
                options={allOptions()}
                onSelect={(val: string) => {
                    const newPeriodSize = parseInt(val)
                    if (isNaN(newPeriodSize)) return
                    periodSize.value = newPeriodSize
                }}
            />
            <SwitchFilterItem
                historyName='average'
                label={t((msg) => msg.habit.period.averageLabel)}
                defaultValue={average.value}
                onChange={(val: boolean) => average.value = val}
            />
        </>
    },
})

export default _default
