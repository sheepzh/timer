import { useShadow } from "@hooks/index"
import Flex from "@pages/components/Flex"
import { ElCard, ElDivider } from "element-plus"
import { defineComponent, type PropType, type StyleValue, watch } from "vue"
import Body from "./Body"
import Header from "./Header"
import { provideItem } from "./useItem"

const Item = defineComponent({
    props: {
        selected: {
            type: Boolean,
            required: false,
        },
        value: {
            type: Object as PropType<timer.limit.Item>,
            required: true,
        }
    },
    emits: {
        selectChange: (_selected: boolean) => true,
    },
    setup(props, ctx) {
        const [selected] = useShadow(() => props.selected)
        watch(selected, () => ctx.emit('selectChange', selected.value))

        provideItem(props.value, selected)

        return () => (
            <ElCard
                shadow="always"
                style={{ height: '100%' } satisfies StyleValue}
                bodyStyle={{ height: '100%', boxSizing: 'border-box', padding: 0 }}
            >
                <Flex direction="column" height='100%'>
                    <Header />
                    <ElDivider style={{ margin: '20px 0' } satisfies StyleValue} />
                    <Body />
                </Flex>
            </ElCard>
        )
    },
})

export default Item