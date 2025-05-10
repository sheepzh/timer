/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import Flex from "@pages/components/Flex"
import { defineComponent } from "vue"
import ChartTitle from "../../ChartTitle"
import BarChart from "./BarChart"
import { initProvider } from "./context"
import HalfBarChart from "./HalfBarChart"
import PieChart from "./PieChart"
import Title from "./Title"

const _default = defineComponent(() => {
    const filter = initProvider()
    return () => {
        return (
            <Flex column gap={4} height="100%">
                <ChartTitle>
                    <Title />
                </ChartTitle >
                <Flex flex={1}>
                    {filter.topKChartType === 'pie' && <PieChart />}
                    {filter.topKChartType === 'bar' && <BarChart />}
                    {filter.topKChartType === 'halfPie' && <HalfBarChart />}
                </Flex>
            </Flex>
        )
    }
})

export default _default