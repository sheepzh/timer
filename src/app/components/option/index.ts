/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h } from "vue"
import Popup from "./components/popup"
import Appearance from "./components/appearance"
import Statistics from "./components/statistics"
import './style'

export default defineComponent(() => {
    return () => h('div',
        { class: 'option-container' },
        [h(Statistics), h(Popup), h(Appearance)]
    )
})