/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import Flex from "@pages/components/Flex"
import { defineComponent, ref } from "vue"
import ContentContainer from "../common/ContentContainer"
import ClearPanel from "./ClearPanel"
import MemoryInfo, { type MemoryInfoInstance } from "./MemoryInfo"
import Migration from "./Migration"

export default defineComponent(() => {
    const memoryInfo = ref<MemoryInfoInstance>()
    const refreshMemory = () => memoryInfo.value?.refresh?.()

    return () => (
        <ContentContainer>
            <Flex gap={22} height={490}>
                <Flex height='100%' flex={8}>
                    <MemoryInfo ref={memoryInfo} />
                </Flex>
                <Flex height='100%' flex={11}>
                    <ClearPanel onDataDelete={refreshMemory} />
                </Flex>
                <Flex height='100%' flex={5}>
                    <Migration onImport={refreshMemory} />
                </Flex>
            </Flex>
        </ContentContainer >
    )
})