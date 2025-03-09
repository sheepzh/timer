/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import ContentContainer from "@app/components/common/ContentContainer"
import { useState } from "@hooks"
import Flex from "@pages/components/Flex"
import { daysAgo } from "@util/time"
import { defineComponent } from "vue"
import HabitFilter, { type FilterOption } from "./components/HabitFilter"
import Period from "./components/Period"
import Site from "./components/Site"
import { initProvider } from "./components/context"

const _default = defineComponent(() => {
    const [filter, setFilter] = useState<FilterOption>({
        dateRange: daysAgo(7, 0),
        timeFormat: "default",
    })
    initProvider(filter)

    return () => (
        <ContentContainer v-slots={{
            filter: () => (
                <HabitFilter
                    defaultValue={filter.value}
                    onChange={val => val && setFilter(val)}
                />
            ),
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
