import { useCached } from "@hooks"
import { ElOption, ElSelect } from "element-plus"
import { defineComponent, type PropType, watch } from "vue"
import { useRoute } from "vue-router"
import { SELECT_WRAPPER_STYLE } from "./common"

const MultiSelectFilterItem = defineComponent({
    props: {
        defaultValue: Array as PropType<(string | number)[]>,
        /**
        * Whether to save the value in the localStorage with {@param historyName}
        */
        historyName: String,
        placeholder: String,
        disabled: Boolean,
        options: Array as PropType<{ value: string | number, label?: string }[]>,
    },
    emits: {
        change: (_val: (string | number)[]) => true,
    },
    setup(props, ctx) {
        const cacheKey = props.historyName && `__filter_item_multi_select_${useRoute().path}_${props.historyName}`
        const { data, setter } = useCached(cacheKey, props.defaultValue)
        watch(data, () => ctx.emit('change', data.value ?? []))

        return () => (
            <ElSelect
                modelValue={data.value}
                onChange={setter}
                multiple
                clearable
                collapseTags
                disabled={props.disabled}
                onClear={() => setter([])}
                placeholder={props.placeholder}
                style={SELECT_WRAPPER_STYLE}
            >
                {props.options?.map(({ value, label }) => <ElOption value={value} label={label ?? value} />)}
            </ElSelect>
        )
    }
})

export default MultiSelectFilterItem