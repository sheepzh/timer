import { defineComponent, h } from 'vue'
import Popup from './components/popup'
import Appearance from './components/appearance'
import './style'

export default defineComponent(() => {
    return () => h('div',
        { class: 'option-container' },
        [h(Popup), h(Appearance)]
    )
})