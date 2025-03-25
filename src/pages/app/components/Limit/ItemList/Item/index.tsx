import Flex from "@pages/components/Flex"
import { ElCard, ElDivider } from "element-plus"
import { computed, defineComponent, type StyleValue, watch } from "vue"
import Body from "./Body"
import Header from "./Header"
import { provideItem } from "./useItem"

type Props = {
    value: timer.limit.Item
    selected: boolean
    onDeleted: NoArgCallback
    onSelectChange: (val: boolean) => void
    onChange?: () => void
}

const Item = defineComponent(
    (props: Props) => {
        const { value, onSelectChange, onChange, onDeleted } = props
        const selected = computed({
            get: () => props.selected,
            set: (val: boolean) => onSelectChange(val)
        })

        const data = provideItem(value, selected, onDeleted)
        watch(data, () => onChange?.())

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
    { props: ['value', 'selected', 'onSelectChange', 'onChange'] }
)

export default Item