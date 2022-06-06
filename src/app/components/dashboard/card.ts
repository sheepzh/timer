/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard, ElCol } from "element-plus"
import { defineComponent, h } from "vue"

const _default = defineComponent({
    name: "DashboardCard",
    props: {
        span: {
            type: Number,
            required: true
        }
    },
    setup(props, ctx) {
        return () => h(ElCol, {
            span: props.span
        }, () => h(ElCard, {
            style: { height: "100%" }
        }, () => h(ctx.slots.default)))
    }
})

export default _default