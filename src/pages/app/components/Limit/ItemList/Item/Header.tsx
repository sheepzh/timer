import { t } from "@app/locale"
import { Calendar, Delete, EditPen, Lock, More, Open, Timer, TurnOff, Unlock } from "@element-plus/icons-vue"
import Flex from "@pages/components/Flex"
import { ElButton, ElCheckbox, ElDropdown, ElDropdownItem, ElDropdownMenu, ElFormItem, ElLink, ElPopover, ElTag, ElText } from "element-plus"
import { computed, defineComponent, toRef, type Component, type StyleValue } from "vue"
import { useHeader, useItem, type SwitchField } from "./context"

const BTN_STYLE: StyleValue = {
    marginInlineStart: 0
}

type Props = {
    field: SwitchField
    label: string
    onIcon: Component
    offIcon?: Component
    onChange?: (val: boolean) => void
}

const SwitchButton = defineComponent((props: Props) => {
    const { field, onIcon, offIcon, onChange, label } = props
    const data = useItem()
    const target = computed(() => data[field])

    return () => (
        <ElPopover
            placement="top"
            showAfter={300}
            hideAfter={50}
            popperStyle={{ width: 'fit-content', minWidth: 'unset' }}
            v-slots={{
                default: () => <>
                    <ElText>{label}</ElText>
                    &ensp;
                    {target.value ? (
                        <ElTag size="small" type="primary">{t(msg => msg.option.yes)}</ElTag>
                    ) : (
                        <ElTag size="small" type="info">{t(msg => msg.option.no)}</ElTag>
                    )}
                </>,
                reference: () => (
                    <ElButton
                        link
                        icon={target.value ? onIcon : offIcon ?? onIcon}
                        type={target.value ? 'primary' : undefined}
                        onClick={() => onChange?.(!data[field])}
                        style={BTN_STYLE}
                    />
                )
            }}
        />
    )
}, { props: ['field', 'offIcon', 'onIcon', 'onChange', 'label'] })

const Weekday = defineComponent((props: { value: timer.limit.Item['weekdays'] }) => {
    const weekdays = toRef(props, 'value')
    const full = computed(() => !weekdays.value?.length || weekdays.value?.length === 7)
    const ALL_WEEKDAYS = t(msg => msg.calendar.weekDays)?.split('|')

    return () => (
        <ElPopover
            placement="top"
            offset={5}
            showAfter={300}
            popperStyle={{ width: 'fit-content' }}
            v-slots={{
                reference: () => (
                    <ElLink
                        underline={false}
                        icon={Calendar}
                        type={full.value ? 'primary' : undefined}
                        style={{ cursor: 'default' } satisfies StyleValue}
                    />
                ),
                default: () => (
                    <ElFormItem
                        label={t(msg => msg.limit.item.effectiveDay)}
                        style={{ marginBottom: 0 } satisfies StyleValue}
                    >
                        {full.value ? (
                            <ElTag size="small" type="primary">
                                {t(msg => msg.calendar.range.everyday)}
                            </ElTag>
                        ) : (
                            <Flex justify="center" wrap="wrap" gap={5} style={{ margin: "0 10px" }}>
                                {weekdays.value?.map(w => <ElTag size="small" type="info">{ALL_WEEKDAYS[w]}</ElTag>)}
                            </Flex>
                        )}
                    </ElFormItem>
                )
            }}
        />
    )
}, { props: ['value'] })

const Header = defineComponent(() => {
    const {
        data, selected,
        changeEnabled,
        changeLocked,
        changeAllowDelay,
        doDelete,
        doModify,
    } = useHeader()

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
                <Weekday value={data.weekdays} />
                <SwitchButton
                    field="allowDelay"
                    onIcon={Timer}
                    onChange={changeAllowDelay}
                    label={t(msg => msg.limit.item.delayAllowed)}
                />
                <SwitchButton
                    field="locked"
                    onIcon={<Lock />} offIcon={<Unlock />}
                    onChange={changeLocked}
                    label={t(msg => msg.limit.item.locked)}
                />
                <SwitchButton
                    field="enabled"
                    onIcon={<Open />} offIcon={<TurnOff />}
                    onChange={changeEnabled}
                    label={t(msg => msg.limit.item.enabled)}
                />
                <ElDropdown
                    v-slots={{
                        dropdown: () => (
                            <ElDropdownMenu>
                                <ElDropdownItem icon={EditPen} onClick={doModify}>
                                    {t(msg => msg.button.modify)}
                                </ElDropdownItem>
                                <ElDropdownItem icon={Delete} onClick={doDelete}>
                                    <ElText type="danger" >
                                        {t(msg => msg.button.delete)}
                                    </ElText>
                                </ElDropdownItem>
                            </ElDropdownMenu>
                        ),
                        default: () => <ElLink icon={More} underline={false} />,
                    }}>
                </ElDropdown>
            </Flex>
        </Flex>
    )
})

export default Header