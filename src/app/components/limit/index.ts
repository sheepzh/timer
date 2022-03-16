/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h, ref, Ref, watch } from "vue"
import ContentContainer from "../common/content-container"
import filter, { FilterProps } from "./filter"
import table from "./table"
import AddDialog from "./add-dialog"
import TimeLimitItem from "@entity/dto/time-limit-item"
import limitService from "@service/limit-service"
import { useRoute, useRouter } from "vue-router"

const urlRef: Ref<string> = ref('')
const onlyEnabledRef: Ref<boolean> = ref(false)

const addDialogRef: Ref = ref()

const listRef: Ref<TimeLimitItem[]> = ref([])

const queryData = async () => {
    const list = await limitService.select({ filterDisabled: onlyEnabledRef.value, url: urlRef.value || '' })
    listRef.value = list
}

watch([urlRef, onlyEnabledRef], queryData)

queryData()

const filterProps: FilterProps = {
    urlRef,
    onlyEnabledRef,
    handleAdd: () => addDialogRef.value.show(),
    handleTest: () => { }
}

const content = (listRef: Ref<TimeLimitItem[]>, addDialogRef: Ref) => [
    table({ list: listRef, queryData }),
    h(AddDialog, { ref: addDialogRef, onSaved: queryData })
]

const _default = defineComponent({
    name: "Limit",
    setup() {
        const url = useRoute().query['url'] as string
        useRouter().replace({ query: {} })
        url && (urlRef.value = decodeURIComponent(url))
        return () => h(ContentContainer, {}, {
            filter: () => filter(filterProps),
            content: () => content(listRef, addDialogRef)
        })
    }
})

export default _default
