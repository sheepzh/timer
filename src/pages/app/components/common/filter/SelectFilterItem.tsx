/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useCached } from "@hooks"
import { ElOption, ElSelect } from "element-plus"
import { defineComponent, watch, type PropType } from "vue"
import { useRoute } from "vue-router"
import { SELECT_WRAPPER_STYLE } from "./common"

const _default = defineComponent({
    props: {
        defaultValue: String,
        /**
         * Whether to save the value in the localStorage with {@param historyName}
         */
        historyName: String,
        options: Object as PropType<Record<string | number, string>>
    },
    emits: {
        select: (_val: string | undefined) => true
    },
    setup(props, ctx) {
        const cacheKey = props.historyName && `__filter_item_select_${useRoute().path}_${props.historyName}`
        const { data, setter } = useCached(cacheKey, props.defaultValue)
        watch(data, () => ctx.emit('select', data.value))
        return () => (
            <ElSelect
                modelValue={data.value}
                onChange={setter}
                style={SELECT_WRAPPER_STYLE}
            >
                {Object.entries(props.options || {}).map(([value, label]) => <ElOption label={label} value={value} />)}
            </ElSelect>
        )
    }
})

export default _default