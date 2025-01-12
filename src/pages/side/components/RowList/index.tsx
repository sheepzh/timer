import { useShadow } from "@hooks"
import Flex from "@pages/components/Flex"
import { sum } from "@util/array"
import { ElEmpty, ElScrollbar, type ScrollbarInstance } from "element-plus"
import { computed, type CSSProperties, defineComponent, type PropType, ref, watch } from "vue"
import Item from "./Item"
import "./row-list.sass"

const _default = defineComponent({
    props: {
        loading: Boolean,
        data: Array as PropType<timer.stat.Row[]>,
        style: Object as PropType<CSSProperties>,
    },
    setup(props) {
        const [data] = useShadow(() => (props.data || []).filter(i => i.focus), [])
        const maxFocus = computed(() => data.value.map(r => r.focus).reduce((a, b) => a > b ? a : b, 0) ?? 0)
        const totalFocus = computed(() => sum(data.value.map(i => i?.focus ?? 0)))
        const scrollbar = ref<ScrollbarInstance>()
        watch(data, () => scrollbar.value?.setScrollTop(0))
        return () => (
            <Flex flex={1} style={props.style}>
                <ElScrollbar v-loading={props.loading} height="100%" ref={scrollbar} style={{ width: '100%' }}>
                    <Flex column gap={8}>
                        {!data.value?.length && !props.loading && <ElEmpty class="row-list-empty" />}
                        {data.value?.map(item =>
                            <Item
                                value={item}
                                max={maxFocus.value}
                                total={totalFocus.value}
                            />
                        )}
                    </Flex>
                </ElScrollbar>
            </Flex>
        )
    }
})

export default _default