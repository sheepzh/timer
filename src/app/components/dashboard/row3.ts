/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElRow } from "element-plus"
import { defineComponent, h } from "vue"
import { useRouter } from "vue-router"

// Only shows in English
const ALERT_TEXT = '💡 Help us translate this extension/addon into your native language!'

const _default = defineComponent({
    name: "DashboardRow3",
    setup() {
        const router = useRouter()
        return () => h(ElRow, {
            gutter: 40,
        }, () => h('span', {
            onClick: () => router.push({ path: '/other/help' }),
            class: 'help-us-link'
        }, ALERT_TEXT))
    }
})

export default _default