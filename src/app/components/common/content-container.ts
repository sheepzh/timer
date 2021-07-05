import { h, VNode } from "vue"

/**
 * @returns the render function of content container 
 */
export function renderContentContainer(childNodes: () => VNode[] | VNode): () => VNode {
    return () => h('div', { class: 'content-container' }, childNodes())
}