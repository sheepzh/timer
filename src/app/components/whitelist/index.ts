/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import '../common/editable-tag'
import { defineComponent } from "vue"
import ContentContainer from "../common/content-container"
import alertInfo from "./alert-info"
import itemList from "./item-list"
import { ElCard } from "element-plus"
import { h } from "vue"

const _default = defineComponent({
    name: "Whitelist",
    render: () => h(ContentContainer,
        () => h(ElCard, () => [alertInfo(), itemList()])
    )
})

export default _default
