/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, ref, toRaw } from "vue"
import ContentContainer from "../common/ContentContainer"
import LimitFilter, { type FilterOption } from "./LimitFilter"
import LimitTable from "./LimitTable"
import LimitModify, { ModifyInstance } from "./LimitModify"
import LimitTest, { TestInstance } from "./LimitTest"
import limitService from "@service/limit-service"
import { useRoute, useRouter } from "vue-router"
import { t } from "@app/locale"
import { ElMessage } from "element-plus"
import { useRequest, useState, useWindowVisible } from "@hooks"
import { deepCopy } from "@util/lang"

const initialUrl = () => {
    // Init with url parameter
    const urlParam = useRoute().query['url'] as string
    useRouter().replace({ query: {} })
    return urlParam ? decodeURIComponent(urlParam) : ''
}

const _default = defineComponent(() => {
    const [filterOption, setFilterOption] = useState<FilterOption>({ url: initialUrl(), onlyEnabled: false })
    const { data, refresh } = useRequest(
        () => limitService.select({ filterDisabled: filterOption.value?.onlyEnabled, url: filterOption.value?.url || '' }),
        { defaultValue: [], deps: filterOption },
    )
    // Query data if the window become visible
    useWindowVisible({ onVisible: refresh })

    const handleDelete = async (row: timer.limit.Item) => {
        await limitService.remove(row)
        ElMessage.success(t(msg => msg.operation.successMsg))
        refresh()
    }

    const modify = ref<ModifyInstance>()
    const test = ref<TestInstance>()

    return () => (
        <ContentContainer
            v-slots={{
                filter: () => (
                    <LimitFilter
                        defaultValue={filterOption.value}
                        onChange={setFilterOption}
                        onCreate={() => modify.value?.create?.()}
                        onTest={() => test.value?.show?.()}
                    />
                ),
                content: () => <>
                    <LimitTable
                        data={data.value}
                        onDelayChange={row => limitService.updateDelay(row)}
                        onEnabledChange={row => limitService.updateEnabled(row)}
                        onDelete={handleDelete}
                        onModify={row => modify.value?.modify?.(deepCopy(toRaw(row)))}
                    />
                    <LimitModify ref={modify} onSave={refresh} />
                    <LimitTest ref={test} />
                </>
            }}
        />
    )
})

export default _default
