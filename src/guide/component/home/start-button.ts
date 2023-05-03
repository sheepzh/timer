/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@guide/locale"
import { START_ROUTE } from "@guide/router/constants"
import { ElButton } from "element-plus"
import { defineComponent, h } from "vue"
import { useRouter } from "vue-router"
import { Document } from "@element-plus/icons-vue"

const _default = defineComponent(() => {
    const router = useRouter()
    return () => h(ElButton, {
        class: 'start-button',
        type: 'primary',
        onClick: () => router.push(START_ROUTE),
        icon: Document,
    }, () => t(msg => msg.home.button))
})

export default _default