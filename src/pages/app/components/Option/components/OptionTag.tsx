import { defineComponent, h, type StyleValue, useSlots } from "vue"

const _default = defineComponent(() => {
    const { default: default_ } = useSlots()
    return () => (
        <a style={{ color: "#F56C6C" } satisfies StyleValue}>
            {!!default_ && h(default_)}
        </a>
    )
})

export default _default