/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElRow, ElCol } from "element-plus"
import { defineComponent, h, Ref, ref } from "vue"
import ContentContainer from "../common/content-container"
import Migration from "./migration"
import MemeryInfo from "./memory-info"
import ClearPanel from "./clear"
import './style'

export default defineComponent({
    name: "DataManage",
    setup() {
        const memeryInfoRef: Ref = ref()
        const queryData = () => memeryInfoRef?.value?.queryData()
        return () => h(ContentContainer, {
            class: 'data-manage-container'
        }, () => h(ElRow, { gutter: 20 },
            () => [
                h(ElCol, { span: 8 }, () => h(MemeryInfo, { ref: memeryInfoRef })),
                h(ElCol, { span: 11 }, () => h(ClearPanel, { onDataDelete: queryData })),
                h(ElCol, { span: 5 }, () => h(Migration, { onImport: queryData })),
            ]
        ))
    }
})