import '../common/editable-tag'
import { defineComponent } from "vue"
import { renderContentContainer } from "../common/content-container"
import alertInfo from './alert-info'
import itemList from './item-list'
import { ElCard } from 'element-plus'
import { h } from "vue"

const card = () => h(ElCard, {}, () => [alertInfo(), itemList()])

const _default = defineComponent(() => {
    return renderContentContainer(() => card())
})

export default _default
