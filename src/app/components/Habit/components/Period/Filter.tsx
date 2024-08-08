/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import SelectFilterItem from '@app/components/common/SelectFilterItem'
import { t } from '@app/locale'
import { useCached } from '@hooks'
import { HabitMessage } from '@i18n/message/app/habit'
import { ElRadioButton, ElRadioGroup } from 'element-plus'
import { PropType, defineComponent, ref, watch } from 'vue'
import { ChartType, FilterOption } from './common'

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

const CHART_CONFIG: { [type in ChartType]: string } = {
    average: t(msg => msg.habit.period.chartType.average),
    trend: t(msg => msg.habit.period.chartType.trend),
    stack: t(msg => msg.habit.period.chartType.stack),
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
        const { data: chartType, setter: setChartType } = useCached<ChartType>('habit-period-chart-type', prop.defaultValue?.chartType)
        watch([periodSize, chartType], () =>
            ctx.emit('change', {
                periodSize: periodSize.value,
                chartType: chartType.value,
            })
        )
        return () => (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'self-start',
                }}
            >
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
                <ElRadioGroup
                    modelValue={chartType.value}
                    onChange={val => val && setChartType(val as ChartType)}
                >
                    {Object.entries(CHART_CONFIG).map(([type, name]) => (
                        <ElRadioButton value={type}>
                            {name}
                        </ElRadioButton>
                    ))}
                </ElRadioGroup>
            </div>
        )
    },
})

export default _default
