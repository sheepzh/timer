/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Check } from "@element-plus/icons-vue"
import { ElButton } from "element-plus"
import { defineComponent, h } from "vue"
import { t } from "@app/locale"

const buttonText = t(msg => msg.limit.button.save)
const _default = defineComponent({
    name: "SaveButton",
    emits: {
        save: () => true
    },
    setup(_, ctx) {
        return () => h('span', {},
            h(ElButton, {
                onClick: () => ctx.emit("save"),
                type: 'primary',
                icon: Check
            }, () => buttonText)
        )
    }
})

export default _default