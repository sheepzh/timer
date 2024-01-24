/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard, ElCol } from "element-plus"
import { defineComponent } from "vue"

const _default = defineComponent({
    props: {
        span: {
            type: Number,
            required: true
        }
    },
    setup(props, ctx) {
        return () => (
            <ElCol span={props.span}>
                <ElCard style={{ height: "100%" }} v-slots={ctx.slots} />
            </ElCol>
        )
    }
})

export default _default