import { useShadow } from "@hooks"
import { sum } from "@util/array"
import { ElEmpty, ElScrollbar, ScrollbarInstance } from "element-plus"
import { computed, defineComponent, PropType, ref, StyleValue, watch } from "vue"
import Item from "./Item"
import "./row-list.sass"

const _default = defineComponent({
    props: {
        loading: Boolean,
        data: Array as PropType<timer.stat.Row[]>,
        style: Object as PropType<StyleValue>,
    },
    setup(props) {
        const [data] = useShadow(() => (props.data || []).filter(i => i.focus), [])
        const maxFocus = computed(() => data.value.map(r => r.focus).reduce((a, b) => a > b ? a : b, 0) ?? 0)
        const totalFocus = computed(() => sum(data.value.map(i => i?.focus ?? 0)))
        const scrollbar = ref<ScrollbarInstance>()
        watch(data, () => scrollbar.value?.setScrollTop(0))
        return () => (
            <div class="item-container" style={props.style}>
                <ElScrollbar v-loading={props.loading} height="100%" ref={scrollbar}>
                    {!data.value?.length && !props.loading && <ElEmpty />}
                    {data.value?.map(item =>
                        <Item
                            value={item}
                            max={maxFocus.value}
                            total={totalFocus.value}
                        />
                    )}
                </ElScrollbar>
            </div>
        )
    }
})

export default _default