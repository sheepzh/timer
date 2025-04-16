/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import ContentContainer from "@app/components/common/ContentContainer"
import Flex from "@pages/components/Flex"
import { defineComponent } from "vue"
import HabitFilter from "./components/HabitFilter"
import Period from "./components/Period"
import Site from "./components/Site"
import { initHabit } from "./components/context"

const _default = defineComponent(() => {
    initHabit()

    return () => (
        <ContentContainer v-slots={{
            filter: () => <HabitFilter />,
            default: () => (
                <Flex direction="column" gap={15}>
                    <Site />
                    <Period />
                </Flex>
            )
        }} />
    )

})

export default _default
