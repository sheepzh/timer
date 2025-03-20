import { ArrowDown } from "@element-plus/icons-vue"
import Flex from "@pages/components/Flex"
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElLink } from "element-plus"
import { type Component, computed, defineComponent, type PropType, VNode } from "vue"

export type DropdownButtonItem<T> = {
    key: T
    icon: Component | VNode
    label: string
}

const DropdownButton = defineComponent({
    props: {
        items: {
            type: Array as PropType<DropdownButtonItem<unknown>[]>,
            required: true,
        },
    },
    emits: {
        click: (_key: unknown) => true,
    },
    setup(props, ctx) {
        const trigger = computed(() => props.items?.[0])
        const list = computed(() => props.items.slice(1))

        return () => !!trigger.value && (
            <Flex align="center" gap={3}>
                <ElButton
                    link
                    type="primary"
                    icon={trigger.value?.icon}
                    onClick={() => ctx.emit('click', trigger.value?.key)}
                >
                    {trigger.value?.label ?? 'NaN'}
                </ElButton>
                {!!list.value?.length && <ElDropdown
                    placement="bottom-end"
                    v-slots={{
                        default: () => <ElLink type="primary" underline={false} icon={ArrowDown} />,
                        dropdown: () => (
                            <ElDropdownMenu>
                                {list.value?.map(({ icon, label, key }) => (
                                    <ElDropdownItem icon={icon} onClick={() => ctx.emit('click', key)}>
                                        {label}
                                    </ElDropdownItem>
                                ))}
                            </ElDropdownMenu>
                        )
                    }}
                />}
            </Flex>
        )
    },
})

export default DropdownButton