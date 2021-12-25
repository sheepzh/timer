/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElRow, ElCol } from "element-plus"
import { defineComponent, h, ref, Ref } from "vue"
import { getUsedStorage } from "@db/memory-detector"
import './style'
import { renderContentContainer } from "../common/content-container"
import migration from "./migration"
import memoryInfo from "./memory-info"
import clearPanel from "./clear"

// Total memory with byte
const usedRef: Ref<number> = ref(0)
const totalRef: Ref<number> = ref(1) // As the denominator of percentage, cannot be 0, so be 1

const queryData = async () => {
    const { used, total } = await getUsedStorage()
    usedRef.value = used || 0
    totalRef.value = total
}

queryData()

const firstRow = () => h(ElRow, { gutter: 20 },
    () => [
        h(ElCol, { span: 8 }, () => memoryInfo({ usedRef, totalRef })),
        h(ElCol, { span: 11 }, () => clearPanel({ queryData })),
        h(ElCol, { span: 5 }, () => migration({ queryData }))
    ]
)

export default defineComponent(() => renderContentContainer(firstRow))