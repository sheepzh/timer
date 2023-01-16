/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElButton } from "element-plus"
import { h, defineComponent } from "vue"
import { t } from "@src/app/locale"
import { Delete } from "@element-plus/icons-vue"

const _default = defineComponent({
    name: "DeleteButton",
    emits: {
        click: () => true
    },
    setup(_, ctx) {
        return () => h('div', { class: 'footer-container filter-container' }, h(ElButton, {
            icon: Delete,
            type: 'danger',
            size: 'small',
            onClick: () => ctx.emit('click')
        }, () => t(msg => msg.item.operation.delete)))
    }
})

export default _default