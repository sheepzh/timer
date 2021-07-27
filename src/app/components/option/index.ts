import { defineComponent, h } from 'vue'
import Popup from './components/popup'
import './style'

export default defineComponent(() => {
    return () => h('div', { class: 'option-container' }, [h(Popup)])
})