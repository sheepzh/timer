/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h } from "vue"
import ContentContainer from "@app/components/common/content-container"

const _default = defineComponent({
    name: 'Dashboard',
    setup() {
        return () => h(ContentContainer)
    }
})

export default _default