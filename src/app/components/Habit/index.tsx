/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { FilterOption } from "./type"

import { defineComponent } from "vue"
import { daysAgo } from "@util/time"
import ContentContainer from "@app/components/common/ContentContainer"
import HabitFilter from "./components/HabitFilter"
import Site from "./components/Site"
import Period from "./components/Period"
import { initProvider } from "./components/context"
import { useState } from "@hooks"

const _default = defineComponent(() => {
    const [filter, setFilter] = useState<FilterOption>({
        dateRange: daysAgo(7, 0),
        timeFormat: "default",
    })
    initProvider(filter)

    return () => (
        <ContentContainer v-slots={{
            filter: () => <HabitFilter defaultValue={filter.value} onChange={val => val && setFilter(val)} />
        }}>
            <Site />
            <Period />
        </ContentContainer>
    )

})

export default _default
