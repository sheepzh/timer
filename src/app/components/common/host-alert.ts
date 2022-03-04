/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElLink } from "element-plus"
import { defineComponent, h } from "vue"

const HOST_ICON_STYLE: Partial<CSSStyleDeclaration> = {
    height: "23px",
    lineHeight: "23px",
    paddingLeft: "2px"
}

const _default = defineComponent({
    name: "HostAlert",
    props: {
        host: {
            type: String,
            required: true
        },
        iconUrl: {
            type: String,
            required: false
        }
    },
    setup(props) {
        return () => h('div', [
            h(ElLink,
                { href: `http://${props.host}`, target: '_blank' },
                () => props.host
            ), h('span',
                { style: HOST_ICON_STYLE },
                h('img', { src: props.iconUrl, width: 12, height: 12 })
            )
        ])
    }
})

export default _default