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
import '../common/editable-tag'
import AlertInfo from "./AlertInfo"
import WhitePanel from "./WhitePanel"

const _default = defineComponent({
    render: () => (
        <ContentContainer>
            <ElCard>
                <Flex column gap={20}>
                    <AlertInfo />
                    <WhitePanel />
                </Flex>
            </ElCard>
        </ContentContainer>
    )
})

export default _default
