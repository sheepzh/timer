/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard } from "element-plus"
import { defineComponent, h, useSlots, VNode } from "vue"

const _default = defineComponent({
    name: "ContentContainer",
    setup() {
        const slots = useSlots()
        const children = []
        const hasDefault = !!slots.default
        if (hasDefault) {
            // Only one content
            children.push(h(slots.default))
        } else {
            // Else filter and content
            const hasFilter = !!slots.filter
            if (hasFilter) {
                children.push(h(ElCard, { class: "filter-container" }, () => h(slots.filter)))
            }
            slots.content && children.push(h(ElCard, { class: 'container-card' }, () => h(slots.content)))
        }

        return () => h("div",
            { class: "content-container" },
            children
        )
    }
})

export default _default