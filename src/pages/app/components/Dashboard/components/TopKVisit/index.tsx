/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { tN } from "@app/locale"
import Flex from "@pages/components/Flex"
import { defineComponent } from "vue"
import ChartTitle from "../../ChartTitle"
import BarChart from "./BarChart"
import { initProvider } from "./context"
import Filter from "./Filter"
import HalfBarChart from "./HalfBarChart"
import PieChart from "./PieChart"
import TitleSelect from "./TitleSelect"

const _default = defineComponent(() => {
    const filter = initProvider()
    return () => {
        return (
            <Flex class="top-visit-container">
                <ChartTitle>
                    <Flex align="center">
                        {tN(msg => msg.dashboard.topK.title, {
                            k: <TitleSelect field="topK" values={[6, 8, 10, 12]} />,
                            day: <TitleSelect field="dayNum" values={[7, 30, 90, 180]} />,
                        })}
                    </Flex>
                </ChartTitle >
                <Filter />
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