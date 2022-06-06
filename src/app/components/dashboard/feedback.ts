/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Headset } from "@element-plus/icons-vue"
import { DASHBOARD_FEEDBACK_PAGE } from "@util/constant/url"
import { Effect, ElButton, ElTooltip } from "element-plus"
import { defineComponent, h } from "vue"

const style: Partial<CSSStyleDeclaration> = {
    width: '100%',
    paddingTop: '10px',
    paddingRight: '40px',
    height: '100px',
    textAlign: 'right'
}

const _default = defineComponent({
    name: "DashboardFeedback",
    render: () => h('div', {
        style
    }, h(ElTooltip, {
        placement: 'top',
        content: t(msg => msg.dashboard.feedback.tooltip),
        effect: Effect.LIGHT,
    }, () => h(ElButton, {
        type: "info",
        size: "mini",
        icon: Headset,
        round: true,
        onClick: () => chrome.tabs.create({
            url: DASHBOARD_FEEDBACK_PAGE
        })
    }, () => t(msg => msg.dashboard.feedback.button))))
})

export default _default