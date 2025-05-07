import { defineComponent } from 'vue'
import {type TopKChartType} from './common'
import { useTopKFilter } from './context'
import SelectFilterItem from "@app/components/common/filter/SelectFilterItem";
import {ElCheckboxGroup, ElRadioButton, ElRadioGroup} from "element-plus";
import {t} from "@app/locale";

type _SizeOption = [number, string]

function allOptions(): Record<number, string> {
    const allOptions: Record<number, string> = {}
    const allSizes: _SizeOption[] = [
        [6, "6"],
        [8, "8"],
        [10, "10"],
    ]
    allSizes.forEach(
        ([size, topk]) => (allOptions[size] = t(msg => msg.dashboard.topK.filter.k[topk]))
    )
    return allOptions
}

const CHART_CONFIG: { [type in TopKChartType]: string } = {
    'pie': t(msg => msg.dashboard.topK.filter.chartType['pie']),
    'bar': t(msg => msg.dashboard.topK.filter.chartType['bar']),
    'halfPie': t(msg => msg.dashboard.topK.filter.chartType['halfPie']),
}

const _default = defineComponent(() => {
    const topKFilter = useTopKFilter()

    return () => (
        <div class="filter">
            <SelectFilterItem
                historyName='topK'
                defaultValue={topKFilter.topK?.toString?.()}
                options={allOptions()}
                onSelect={val => {
                    if (!val) return
                    const newTopK = parseInt(val)
                    if (isNaN(newTopK)) return
                    topKFilter.topK = newTopK
                }}
                style={{width: "30%"}}
            />
            <ElRadioGroup
                modelValue={topKFilter.topKChartType}
                onChange={val => {
                    if (val === undefined) return
                    if (val === 'pie' || val === 'bar' || val === 'halfPie') {
                        topKFilter.topKChartType = val as TopKChartType
                    }
                }}
            >
                {Object.entries(CHART_CONFIG).map(([type, name]) => (
                    <ElRadioButton value={type}>
                        {name}
                    </ElRadioButton>
                ))}
            </ElRadioGroup>
        </div>
    )
})

export default _default