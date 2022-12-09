/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Pointer } from "@element-plus/icons-vue"
import { CROWDIN_HOMEPAGE } from "@util/constant/url"
import { ElButton } from "element-plus"
import { defineComponent, h } from "vue"

function openCrowdin() {
    window.open(CROWDIN_HOMEPAGE, '_blank')
}


const _default = defineComponent({
    name: "HelpUsToolbar",
    render: () => h('div', {
        class: 'toolbar-container'
    }, [
        h(ElButton, {
            type: 'primary',
            size: 'large',
            icon: Pointer,
            onClick: openCrowdin
        }, () => t(msg => msg.helpUs.button)),
    ])
})

export default _default