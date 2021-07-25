import { defineComponent, h } from 'vue'
import PopupMax from './popup-max'
import './style'

export default defineComponent(() => {
    return () => h('div', { class: 'option-container' }, [h(PopupMax)])
})