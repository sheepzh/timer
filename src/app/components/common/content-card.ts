/**
 * Copyright (c) 2023 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard } from "element-plus"
import { defineComponent, h, useSlots } from "vue"

const _default = defineComponent(() => {
    const { default: default_ } = useSlots()
    return () => h(ElCard, { class: 'container-card' }, () => h(default_))
})

export default _default