/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@guide/locale"
import { defineComponent, h } from "vue"
import DownloadButton from "./download-button"
import StartButton from "./start-button"
import './home.sass'

const PIC_URL = chrome.runtime.getURL("static/images/guide/home.png")

const _default = defineComponent(() => {
    return () => h('div', { class: 'home-container' }, [
        h('h1', { class: 'slogan' }, t(msg => msg.meta.slogan)),
        h('img', { src: PIC_URL }),
        h('p', { class: 'desc' }, t(msg => msg.home.desc)),
        h('div', { class: 'button-container' }, [
            h(StartButton),
            h(DownloadButton)
        ]),
    ])
})

export default _default