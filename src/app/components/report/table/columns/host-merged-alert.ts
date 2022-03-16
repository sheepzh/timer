/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Effect, ElTooltip } from "element-plus"
import { defineComponent, h } from "vue"

/**
 * Merged host column
 * 
 * @since 0.7.0
 */
const _default = defineComponent({
    name: "HostMergedAlert",
    props: {
        mergedHost: {
            type: String,
            required: true
        }
    },
    setup(props, ctx) {
        return () => h(ElTooltip, {
            placement: "left",
            effect: Effect.LIGHT,
            offset: 10
        }, {
            default: () => h('a',
                { class: 'el-link el-link--default is-underline' },
                h('span', { class: 'el-link--inner' }, props.mergedHost)
            ),
            content: () => h(ctx.slots.default)
        })
    }
})

export default _default