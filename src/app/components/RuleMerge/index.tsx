/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import '../common/editable-tag'
import { defineComponent } from "vue"
import ContentContainer from "../common/content-container"
import AlertInfo from "./AlertInfo"
import itemList from "./item-list"
import { ElCard } from "element-plus"

const _default = defineComponent({
    render: () => (
        <ContentContainer>
            <ElCard>
                <AlertInfo />
                {itemList()}
            </ElCard>
        </ContentContainer>
    )
})

export default _default
