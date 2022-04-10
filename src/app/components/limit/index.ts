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
import AddDialog from "./add-dialog"
import TimeLimitItem from "@entity/dto/time-limit-item"
import limitService from "@service/limit-service"
import { useRoute, useRouter } from "vue-router"
import { t } from "@app/locale"
import { ElMessage } from "element-plus"

const _default = defineComponent({
    name: "Limit",
    setup() {
        const url: Ref<string> = ref('')
        const onlyEnabled: Ref<boolean> = ref(false)
        const dialogRef: Ref = ref()
        const data: Ref<TimeLimitItem[]> = ref([])
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

        return () => h(ContentContainer, {}, {
            filter: () => h(LimitFilter, {
                url: url.value,
                onlyEnabled: onlyEnabled.value,
                onChange(option: LimitFilterOption) {
                    url.value = option.url
                    onlyEnabled.value = option.onlyEnabled
                    queryData()
                },
                onCreate: () => dialogRef.value?.show?.()
            }),
            content: () => [
                h(LimitTable, {
                    data: data.value,
                    onDelayChange: (row: TimeLimitItem) => limitService.updateDelay(row),
                    onEnabledChange: (row: TimeLimitItem) => limitService.update(row),
                    async onDelete(row: TimeLimitItem) {
                        await limitService.remove(row.cond)
                        ElMessage.success(t(msg => msg.limit.message.deleted))
                        queryData()
                    }
                }),
                h(AddDialog, {
                    ref: dialogRef,
                    onSaved: queryData
                })
            ]
        })
    }
})

export default _default
