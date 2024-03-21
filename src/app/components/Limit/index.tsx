/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, onMounted, ref, Ref } from "vue"
import ContentContainer from "../common/content-container"
import LimitFilter from "./LimitFilter"
import LimitTable from "./LimitTable"
import LimitModify, { ModifyInstance } from "./LimitModify"
import LimitTest, { TestInstance } from "./LimitTest"
import limitService from "@service/limit-service"
import { useRoute, useRouter } from "vue-router"
import { t } from "@app/locale"
import { ElMessage } from "element-plus"
import { useWindowVisible } from "@app/hooks/useWindowVisible"

const initialUrl = () => {
    // Init with url parameter
    const urlParam = useRoute().query['url'] as string
    useRouter().replace({ query: {} })
    return urlParam ? decodeURIComponent(urlParam) : ''
}

const _default = defineComponent(() => {
    const url: Ref<string> = ref(initialUrl())
    const onlyEnabled: Ref<boolean> = ref(false)
    const data: Ref<timer.limit.Item[]> = ref([])
    // Init and query
    const queryData = async () => {
        const list = await limitService.select({ filterDisabled: onlyEnabled.value, url: url.value || '' })
        data.value = list
    }
    onMounted(queryData)
    // Query data if the window become visible
    useWindowVisible(queryData)

    const modify: Ref<ModifyInstance> = ref()
    const test: Ref<TestInstance> = ref()

    return () => (
        <ContentContainer
            v-slots={{
                filter: () => (
                    <LimitFilter
                        url={url.value}
                        onlyEnabled={onlyEnabled.value}
                        onChange={option => {
                            url.value = option.url
                            onlyEnabled.value = option.onlyEnabled
                            queryData()
                        }}
                        onCreate={() => modify.value?.create?.()}
                        onTest={() => test.value?.show?.()}
                    />
                ),
                content: () => <>
                    <LimitTable
                        data={data.value}
                        onDelayChange={row => limitService.updateDelay(row)}
                        onEnabledChange={row => limitService.updateEnabled(row)}
                        onDelete={async row => {
                            await limitService.remove(row)
                            ElMessage.success(t(msg => msg.limit.message.deleted))
                            queryData()
                        }}
                        onModify={row => modify.value?.modify?.(row)}
                    />
                    <LimitModify ref={modify} onSave={queryData} />
                    <LimitTest ref={test} />
                </>
            }}
        />
    )
})

export default _default
