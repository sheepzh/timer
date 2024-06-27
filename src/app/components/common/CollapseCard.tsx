import { ArrowDown, ArrowUp } from "@element-plus/icons-vue"
import { useSwitch } from "@hooks"
import { classNames } from "@util/style"
import { ElCard, ElIcon, ElText } from "element-plus"
import { defineComponent, useSlots } from "vue"

const _default = defineComponent({
    props: {
        title: String
    },
    setup: props => {
        const [isOpen, _1, _2, toggle] = useSwitch(true)
        const slots = useSlots()
        return () => (
            <ElCard
                class={classNames('collapse-card', isOpen.value ? 'open' : 'collapse')}
                v-slots={{
                    header: () => (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <ElText type="primary" size="large" style={{ fontWeight: 450 }}>
                                {props.title}
                            </ElText>
                            <span
                                onClick={toggle}
                                style={{ cursor: 'pointer' }}
                            >
                                <ElIcon>
                                    {isOpen.value ? <ArrowUp /> : <ArrowDown />}
                                </ElIcon>
                            </span>
                        </div>
                    ),
                    default: slots.default || '',
                }}
            />
        )
    }
})

export default _default