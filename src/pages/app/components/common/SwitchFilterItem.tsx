/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { ElSwitch } from "element-plus"
import { defineComponent, watch } from "vue"
import { useRoute } from "vue-router"
import { useCached } from "@hooks"

const _default = defineComponent({
    emits: {
        change: (_val: boolean) => true
    },
    props: {
        label: String,
        defaultValue: Boolean,
        historyName: String,
    },
    setup(props, ctx) {
        const cacheKey = `__filter_item_switch_${useRoute().path}_${props.historyName}`
        const { data, setter } = useCached(cacheKey, props.defaultValue)
        watch(data, () => ctx.emit("change", data.value))

        return () => (
            <span class='filter-item filter-switch'>
                <a class='filter-name'>{props.label}</a>
                <ElSwitch modelValue={data.value} onChange={setter} />
            </span>
        )
    }
})

export default _default