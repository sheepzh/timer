/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { HelpUsMessage } from "@i18n/message/app/help-us"
import { ElAlert } from "element-plus"
import { defineComponent, h } from "vue"

const title = t(msg => msg.helpUs.title)

const liKeys: (keyof HelpUsMessage['alert'])[] = ["l1", "l2", "l3", "l4"]

const _default = defineComponent({
    name: "HelpUsAlertInfo",
    render: () => h(ElAlert,
        { type: 'info', title },
        () => liKeys.map(key => h('li', t(msg => msg.helpUs.alert[key])))
    )
})

export default _default
