/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import limitService from "@service/limit-service"
import { deepCopy } from "@util/lang"
import { ElMessage } from "element-plus"
import { defineComponent, ref, toRaw } from "vue"
import { useRoute, useRouter } from "vue-router"
import ContentContainer from "../common/ContentContainer"
import { verifyCanModify } from "./common"
import { initProvider } from "./context"
import LimitFilter from "./LimitFilter"
import LimitModify, { type ModifyInstance } from "./LimitModify"
import LimitTable, { type LimitTableInstance } from "./LimitTable"
import LimitTest, { type TestInstance } from "./LimitTest"

const initialUrl = () => {
    // Init with url parameter
    const urlParam = useRoute().query['url'] as string
    useRouter().replace({ query: {} })
    return urlParam ? decodeURIComponent(urlParam) : ''
}

const _default = defineComponent(() => {
    const { filter, setFilter } = initProvider({ url: initialUrl(), onlyEnabled: false })

    const modify = ref<ModifyInstance>()
    const test = ref<TestInstance>()
    const table = ref<LimitTableInstance>()

    const selectedAndThen = (then: (list: timer.limit.Item[]) => void): void => {
        const list = table.value?.getSelected?.()
        if (!list.length) {
            ElMessage.info('No limit rule selected')
            return
        }
        then(list)
    }

    const onBatchSuccess = () => {
        ElMessage.success(t(msg => msg.operation.successMsg))
        table.value?.refresh?.()
    }

    const handleBatchDelete = (list: timer.limit.Item[]) => verifyCanModify(...list)
        .then(() => limitService.remove(...list))
        .then(onBatchSuccess)
        .catch(() => { })

    const handleBatchEnable = (list: timer.limit.Item[]) => {
        list.forEach(item => item.enabled = true)
        limitService.updateEnabled(...list).then(onBatchSuccess).catch(() => { })
    }

    const handleBatchDisable = (list: timer.limit.Item[]) => verifyCanModify(...list)
        .then(() => {
            list.forEach(item => item.enabled = false)
            return limitService.updateEnabled(...list)
        })
        .then(onBatchSuccess)
        .catch(() => { })

    return () => (
        <ContentContainer
            v-slots={{
                filter: () => (
                    <LimitFilter
                        defaultValue={filter.value}
                        onChange={setFilter}
                        onCreate={() => modify.value?.create?.()}
                        onTest={() => test.value?.show?.()}
                        onBatchDelete={() => selectedAndThen(handleBatchDelete)}
                        onBatchEnable={() => selectedAndThen(handleBatchEnable)}
                        onBatchDisable={() => selectedAndThen(handleBatchDisable)}
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
