/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard, ElCol } from "element-plus"
import { defineComponent, useSlots } from "vue"

const _default = defineComponent<{ span: number }>(props => {
    const slots = useSlots()

    return () => (
        <ElCol span={props.span}>
            <ElCard style={{ height: "100%" }} v-slots={slots} />
        </ElCol>
    )
}, { props: ['span'] })

export default _default
