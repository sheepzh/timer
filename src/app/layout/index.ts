import { ElAside, ElContainer } from "element-plus"
import { defineComponent, h } from "vue"
import Menu from './menu'
import { RouterView } from "vue-router"

const layoutContent = () => [
    h(ElAside, { width: '270px' }, () => h(Menu)),
    h(ElContainer, { class: 'app-container' }, () => h(RouterView))
]

export default defineComponent(() => () => h(ElContainer, {}, () => layoutContent()))
