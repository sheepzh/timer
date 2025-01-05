/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

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
                <AlertInfo />
                <WhitePanel />
            </ElCard>
        </ContentContainer>
    )
})

export default _default
