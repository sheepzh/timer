/**
 * Copyright (c) 2021-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard, ElScrollbar } from "element-plus"
import ContentCard from "./content-card"
import { defineComponent, h, useSlots } from "vue"

const _default = defineComponent(() => {
    const slots = useSlots()
    const children = []
    const { default: default_, filter, content } = slots
    filter && children.push(h(ElCard, { class: "filter-container" }, () => h(filter)))
    if (default_) {
        children.push(h(slots.default))
    } else {
        content && children.push(h(ContentCard, () => h(content)))
    }
    return () => h(ElScrollbar, () => h("div", { class: "content-container" }, children))
})

export default _default