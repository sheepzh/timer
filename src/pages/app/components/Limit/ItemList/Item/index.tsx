import Flex from "@pages/components/Flex"
import { ElCard, ElDivider } from "element-plus"
import { computed, defineComponent, reactive, type StyleValue, watch } from "vue"
import Body from "./Body"
import Header from "./Header"
import { provideItem } from "./context"

type Props = {
    value: timer.limit.Item
    selected: boolean
    onDeleted: NoArgCallback
    onSelectChange: (val: boolean) => void
    onChanged?: () => void
    onModifyClick?: () => void
}

const Item = defineComponent((props: Props) => {
    const { value, onSelectChange, onChanged, onDeleted, onModifyClick } = props
    const selected = computed({
        get: () => props.selected,
        set: (val: boolean) => onSelectChange(val)
    })

    const data = reactive(value)

    provideItem({
        data, selected,
        onDeleted,
        onModify: () => onModifyClick?.(),
    })
    watch(data, () => onChanged?.())

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
}, { props: ['value', 'selected', 'onSelectChange', 'onChanged', 'onModifyClick'] })

export default Item