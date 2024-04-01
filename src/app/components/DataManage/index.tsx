/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElRow, ElCol } from "element-plus"
import { defineComponent, ref } from "vue"
import ContentContainer from "../common/ContentContainer"
import Migration from "./Migration"
import MemoryInfo, { MemoryInfoInstance } from "./MemoryInfo"
import ClearPanel from "./ClearPanel"
import './style'

export default defineComponent(() => {
    const memoryInfo = ref<MemoryInfoInstance>()
    const refreshMemory = () => memoryInfo.value?.refresh?.()

    return () => (
        <ContentContainer class="data-manage-container">
            <ElRow gutter={20}>
                <ElCol span={8}>
                    <MemoryInfo ref={memoryInfo} />
                </ElCol>
                <ElCol span={11}>
                    <ClearPanel onDataDelete={refreshMemory} />
                </ElCol>
                <ElCol span={5}>
                    <Migration onImport={refreshMemory} />
                </ElCol>
            </ElRow>
        </ContentContainer>
    )
})