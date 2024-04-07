/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard, ElCol } from "element-plus"
import { defineComponent } from "vue"

const clzName = (noPadding: boolean) => {
    const names = ['dashboard-card']
    noPadding && names.push('no-padding')
    return names.join(' ')
}

const _default = defineComponent({
    props: {
        noPadding: Boolean,
        span: {
            type: Number,
            required: true
        }
    },
    setup(props, ctx) {
        return () => (
            <ElCol span={props.span}>
                <ElCard class={clzName(props.noPadding)} style={{ height: "100%" }} v-slots={ctx.slots} />
            </ElCol>
        )
    }
})

export default _default