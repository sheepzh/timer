/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h } from "vue"

const _default = defineComponent({
    props: {
        path: String,
    },
    setup(props) {
        return () => h('svg', {
            viewBox: "0 0 1024 1024",
            xmlns: "http://www.w3.org/2000/svg"
        }, h("path", { d: props.path }))
    }
})

export default _default