/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"
import type { FilterOption } from "./type"

import { defineComponent, ref } from "vue"
import { daysAgo } from "@util/time"
import ContentContainer from "@app/components/common/ContentContainer"
import HabitFilter from "./components/HabitFilter"
import Site from "./components/Site"
import Period from "./components/Period"
import { initProvider } from "./components/context"

const _default = defineComponent(() => {
    const filter: Ref<FilterOption> = ref({
        dateRange: daysAgo(7, 0),
        timeFormat: "default",
    })
    initProvider(filter)

    return () => (
        <ContentContainer v-slots={{
            filter: () => <HabitFilter defaultValue={filter.value} onChange={val => val && (filter.value = { ...val })} />
        }}>
            <Site />
            <Period />
        </ContentContainer>
    )

})

export default _default
