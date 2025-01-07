/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useState } from "@hooks"
import limitService from "@service/limit-service"
import { deepCopy } from "@util/lang"
import { defineComponent, ref, toRaw } from "vue"
import { useRoute, useRouter } from "vue-router"
import ContentContainer from "../common/ContentContainer"
import { initProvider } from "./context"
import LimitFilter from "./LimitFilter"
import LimitModify, { type ModifyInstance } from "./LimitModify"
import LimitTable, { type LimitTableInstance } from "./LimitTable"
import LimitTest, { type TestInstance } from "./LimitTest"
import type { LimitFilterOption } from "./types"

const initialUrl = () => {
    // Init with url parameter
    const urlParam = useRoute().query['url'] as string
    useRouter().replace({ query: {} })
    return urlParam ? decodeURIComponent(urlParam) : ''
}

const _default = defineComponent(() => {
    const [filter, setFilter] = useState<LimitFilterOption>({ url: initialUrl(), onlyEnabled: false })
    initProvider(filter)

    const modify = ref<ModifyInstance>()
    const test = ref<TestInstance>()
    const table = ref<LimitTableInstance>()

    return () => (
        <ContentContainer
            v-slots={{
                filter: () => (
                    <LimitFilter
                        defaultValue={filter.value}
                        onChange={setFilter}
                        onCreate={() => modify.value?.create?.()}
                        onTest={() => test.value?.show?.()}
                    />
                ),
                content: () => <>
                    <LimitTable
                        ref={table}
                        onDelayChange={row => limitService.updateDelay(row)}
                        onEnabledChange={row => limitService.updateEnabled(row)}
                        onModify={row => modify.value?.modify?.(deepCopy(toRaw(row)))}
                    />
                    <LimitModify ref={modify} onSave={() => table.value?.refresh?.()} />
                    <LimitTest ref={test} />
                </>
            }}
        />
    )
})

export default _default
