/**
 * Copyright (c) 2023 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard } from "element-plus"
import { defineComponent, h } from "vue"

const _default = defineComponent({
    props: {
        title: String
    },
    setup(props, ctx) {
        const slots = ctx.slots
        const { default: default_ } = slots
        return () => {
            const title = h('div', { class: 'analysis-row-title' }, props.title)
            return h(ElCard, { class: 'analysis-row-card' }, () => [title, h(default_, { class: 'analysis-row-body' })])
        }
    }
})

export default _default