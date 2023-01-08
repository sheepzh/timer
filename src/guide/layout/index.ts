/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import { ElContainer, ElAside, ElMain } from "element-plus"
import { defineComponent, ref, h } from "vue"
import Content from "./content"
import Menu from "./menu"

const _default = defineComponent({
    name: "Guide",
    render() {
        const position: Ref<Position> = ref()
        return h(ElContainer, { class: 'guide-container' }, () => [
            h(ElAside, {}, () => h(Menu, { onClick: (newPosition: Position) => position.value = newPosition })),
            h(ElContainer, {
                id: 'app-body'
            }, () => h(ElMain, {}, () => h(Content, { position: position.value })))
        ])
    }
})

export default _default