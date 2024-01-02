/**
 * Copyright (c) 2023 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard } from "element-plus"
import { defineComponent, h } from "vue"
import "./card.sass"

const _default = defineComponent({
    props: {
        title: String
    },
    setup(props, ctx) {
        const { default: default_, filter } = ctx.slots
        return () => h(ElCard, { class: 'kanban-card' }, () => [
            h('div', { class: 'kanban-card-title' }, props.title),
            filter ? h('div', { class: 'kanban-card-filter-wrapper' }, h(filter)) : null,
            h(default_, { class: 'kanban-card-body' }),
        ])
    },
})

export default _default