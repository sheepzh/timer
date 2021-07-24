import { defineComponent, h } from "vue"
import labels from "./label"
import tags from "./tag"

const _default = defineComponent(() => () => h('div', [labels(), tags()]))

export default _default