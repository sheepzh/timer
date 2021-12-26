/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h, ref, Ref, watch } from "vue"
import { renderContentContainer, contentContainerCardStyle } from "../common/content-container"
import filter, { FilterProps } from "./filter"
import table from "./table"
import AddDialog from "./add-dialog"
import TimeLimitItem from "@entity/dto/time-limit-item"
import limitService from "@service/limit-service"
import { useRoute, useRouter } from "vue-router"
import { ElCard } from "element-plus"

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

const card = (listRef: Ref<TimeLimitItem[]>, addDialogRef: Ref) => h(ElCard,
    contentContainerCardStyle,
    () => [
        table({ list: listRef, queryData }),
        h(AddDialog, { ref: addDialogRef, onSaved: queryData })
    ]
)

const childNodes = () => [
    filter(filterProps),
    card(listRef, addDialogRef)
]

const _default = defineComponent(() => {
    const url = useRoute().query['url'] as string
    // Remove all the query params
    useRouter().replace({ query: {} })
    url && (urlRef.value = decodeURIComponent(url))
    return renderContentContainer(childNodes)
})

export default _default
