import { CirclePlus, Delete, EditPen, Lock, Open, TurnOff, Unlock } from "@element-plus/icons-vue"
import Flex from "@pages/components/Flex"
import { ElButton, ElCheckbox, ElText } from "element-plus"
import { Component, computed, defineComponent, type PropType, type StyleValue } from "vue"
import { useItem } from "./useItem"

const BTN_STYLE: StyleValue = {
    marginInlineStart: 0
}

type SwitchField = keyof timer.limit.Item & ('enabled' | 'allowDelay' | 'locked')

const SwitchButton = defineComponent({
    props: {
        field: {
            type: String as PropType<SwitchField>,
            required: true,
        },
        onIcon: {
            type: Object as PropType<Component>,
            required: true,
        },
        offIcon: Object as PropType<Component>,
    },
    setup(props) {
        const { field, onIcon, offIcon } = props
        const { data } = useItem()
        const target = computed(() => data[field])

        return () => (
            <ElButton
                link
                icon={target.value ? onIcon : offIcon ?? onIcon}
                type={target.value ? 'primary' : undefined}
                onClick={() => data[field] = !data[field]}
                style={BTN_STYLE}
            />
        )
    },
})


const Header = defineComponent(() => {
    const { data, selected } = useItem()

    const handleDelete = () => { }

    const handleEdit = () => { }

    return () => (
        <Flex justify="space-between" gap={20} padding="20px 20px 0 20px">
            <Flex flex={1} align="center" gap={10}>
                <ElCheckbox
                    modelValue={selected.value}
                    onChange={(val => selected.value = val as boolean)}
                    style={{ marginTop: '2px' } satisfies StyleValue}
                />
                <ElText size="large">{data.name ?? 'Unnamed'}</ElText>
            </Flex>
            <Flex gap={5}>
                <ElButton link icon={EditPen} onClick={handleEdit} style={BTN_STYLE} />
                <SwitchButton field="allowDelay" onIcon={CirclePlus} />
                <SwitchButton field="locked" onIcon={<Lock />} offIcon={<Unlock />} />
                <SwitchButton field="enabled" onIcon={<Open />} offIcon={<TurnOff />} />
                <ElButton link icon={Delete} onClick={handleDelete} style={BTN_STYLE} />
            </Flex>
        </Flex>
    )
})

export default Header