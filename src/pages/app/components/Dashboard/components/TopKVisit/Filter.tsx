import { t } from "@app/locale"
import Flex from "@pages/components/Flex"
import { ElRadioButton, ElRadioGroup } from "element-plus"
import { defineComponent } from 'vue'
import { TopKChartType, useTopKFilter } from './context'

const CHART_CONFIG: { [type in TopKChartType]: string } = {
    'pie': t(msg => msg.dashboard.topK.filter.chartType['pie']),
    'bar': t(msg => msg.dashboard.topK.filter.chartType['bar']),
    'halfPie': t(msg => msg.dashboard.topK.filter.chartType['halfPie']),
}

const _default = defineComponent(() => {
    const topKFilter = useTopKFilter()

    return () => (
        <Flex justify="end" marginBlock="6px 10px">
            <ElRadioGroup
                size="small"
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
        </Flex>
    )
})

export default _default