/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import Flex from "@pages/components/Flex"
import { defineComponent } from "vue"
import ContentContainer from "../common/ContentContainer"
import AnalysisFilter from "./components/AnalysisFilter"
import Summary from "./components/Summary"
import Trend from "./components/Trend"
import { initAnalysis } from "./context"

const _default = defineComponent(() => {
    const { loading } = initAnalysis()

    return () => <ContentContainer
        v-slots={{
            filter: () => <AnalysisFilter />,
            default: () => (
                <Flex v-loading={loading.value} direction="column" gap={15}>
                    <Summary />
                    <Trend />
                </Flex>
            )
        }}
    />
})

export default _default
