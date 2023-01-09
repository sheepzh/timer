/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h, ref, Ref } from "vue"
import ContentContainer from "../common/content-container"
import LimitFilter, { LimitFilterOption } from "./filter"
import LimitTable from "./table"
import Modify from "./modify"
import limitService from "@service/limit-service"
import { useRoute, useRouter } from "vue-router"
import { t } from "@app/locale"
import { ElMessage } from "element-plus"

const _default = defineComponent({
    name: "Limit",
    setup() {
        const url: Ref<string> = ref('')
        const onlyEnabled: Ref<boolean> = ref(false)
        const data: Ref<timer.limit.Item[]> = ref([])
        // Init and query
        const queryData = async () => {
            const list = await limitService.select({ filterDisabled: onlyEnabled.value, url: url.value || '' })
            data.value = list
        }
        queryData()
        // Init with url parameter
        const urlParam = useRoute().query['url'] as string
        useRouter().replace({ query: {} })
        urlParam && (url.value = decodeURIComponent(urlParam))

        const modify: Ref = ref()

        return () => h(ContentContainer, {}, {
            filter: () => h(LimitFilter, {
                url: url.value,
                onlyEnabled: onlyEnabled.value,
                onChange(option: LimitFilterOption) {
                    url.value = option.url
                    onlyEnabled.value = option.onlyEnabled
                    queryData()
                },
                onCreate: () => modify.value?.create?.()
            }),
            content: () => [
                h(LimitTable, {
                    data: data.value,
                    onDelayChange: (row: timer.limit.Item) => limitService.updateDelay(row),
                    onEnabledChange: (row: timer.limit.Item) => limitService.update(row),
                    async onDelete(row: timer.limit.Item) {
                        await limitService.remove(row)
                        ElMessage.success(t(msg => msg.limit.message.deleted))
                        queryData()
                    },
                    async onModify(row: timer.limit.Item) {
                        modify.value?.modify?.(row)
                    }
                }),
                h(Modify, {
                    ref: modify,
                    onSave: queryData
                })
            ]
        })
    }
})

export default _default
