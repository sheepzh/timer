/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTooltip } from "element-plus"
import { defineComponent, h } from "vue"
import SvgIcon from "./svg-icon"

const _default = defineComponent({
    props: {
        path: String,
        tip: String,
        href: String,
    },
    setup(props) {
        return () => h(ElTooltip, {
            effect: 'dark',
            placement: 'bottom',
            content: props.tip,
            offset: 5,
            showArrow: false,
        }, () => h('a', {
            href: props.href,
            target: '_blank',
            class: 'icon-link',
        }, h(SvgIcon, { path: props.path })))
    }
})

export default _default