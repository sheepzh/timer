import { Delete, EditPen, Lock, Open, Timer, TurnOff, Unlock } from "@element-plus/icons-vue"
import Flex from "@pages/components/Flex"
import { ElButton, ElCheckbox, ElText } from "element-plus"
import { Component, computed, defineComponent, type StyleValue } from "vue"
import { type SwitchField, useItem } from "./useItem"

const BTN_STYLE: StyleValue = {
    marginInlineStart: 0
}

type Props = {
    field: SwitchField
    onIcon: Component
    offIcon?: Component
    onChange?: (val: boolean) => void
}

const SwitchButton = defineComponent(
    (props: Props) => {
        const { field, onIcon, offIcon, onChange } = props
        const { data } = useItem()
        const target = computed(() => data[field])

        return () => (
            <ElButton
                link
                icon={target.value ? onIcon : offIcon ?? onIcon}
                type={target.value ? 'primary' : undefined}
                onClick={() => onChange?.(!data[field])}
                style={BTN_STYLE}
            />
        )
    },
    {
        props: ['field', 'offIcon', 'onIcon', 'onChange']
    }
)

const Header = defineComponent(() => {
    const {
        data, selected,
        changeEnabled,
        changeLocked,
        changeAllowDelay,
        doDelete,
    } = useItem()


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
                <SwitchButton field="allowDelay" onIcon={Timer} onChange={changeAllowDelay} />
                <SwitchButton field="locked" onIcon={<Lock />} offIcon={<Unlock />} onChange={changeLocked} />
                <SwitchButton field="enabled" onIcon={<Open />} offIcon={<TurnOff />} onChange={changeEnabled} />
                <ElButton link icon={Delete} onClick={doDelete} style={BTN_STYLE} />
            </Flex>
        </Flex>
    )
})

export default Header