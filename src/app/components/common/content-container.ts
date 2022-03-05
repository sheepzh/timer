/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h, VNode } from "vue"

/**
 * @returns the render function of content container 
 */
export function renderContentContainer(childNodes: () => VNode[] | VNode): () => VNode {
    return () => h('div', { class: 'content-container' }, childNodes())
}

export const contentContainerCardStyle = { class: 'container-card' }

const _default = defineComponent({
    name: "ContentContainer",
    setup(_, ctx) {
        return () => h("div",
            { class: "content-container" },
            () => {
                const child = []
                ctx.slots.filter && child.push(h(ctx.slots.filter))
                child.push(h(ctx.slots.content))
                return child
            }
        )
    }
})

export default _default