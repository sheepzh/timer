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
        },
        height: Number,
        xs: Number,
        sm: Number,
        md: Number,
        lg: Number,
        xl: Number,
    },
    setup(props, ctx) {
        return () => (
            <ElCol
                span={props.span}
                xs={props.xs}
                sm={props.sm}
                md={props.md}
                lg={props.lg}
                xl={props.xl}
            >
                <ElCard class={clzName(props.noPadding)} style={{ height: "100%" }} v-slots={ctx.slots} />
            </ElCol>
        )
    }
})

export default _default
