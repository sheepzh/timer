import { defineComponent, h } from "vue"

const _default = defineComponent((_, ctx) => {
    return () => <a class="option-tag">{h(ctx.slots.default)}</a>
})

export default _default