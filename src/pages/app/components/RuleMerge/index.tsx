/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import Flex from "@pages/components/Flex"
import { ElCard } from "element-plus"
import { defineComponent } from "vue"
import ContentContainer from "../common/ContentContainer"
import AlertInfo from "./AlertInfo"
import ItemList from "./ItemList"

const RuleMerge = defineComponent(() => {
    return () => (
        <ContentContainer>
            <ElCard>
                <Flex column gap={20}>
                    <AlertInfo />
                    <ItemList />
                </Flex>
            </ElCard>
        </ContentContainer>
    )
})

export default RuleMerge
