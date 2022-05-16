/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElAlert } from "element-plus"
import { t, tN } from "@app/locale"
import { defineComponent, h } from "vue"
import { MergeRuleMessage } from "@app/locale/components/merge-rule"
import { PSL_HOMEPAGE } from "@util/constant/url"

const liKeys: (keyof MergeRuleMessage)[] = ['infoAlert0', 'infoAlert1', 'infoAlert2', 'infoAlert3', 'infoAlert4']
const title = t(msg => msg.mergeRule.infoAlertTitle)

const pslStyle: Partial<CSSStyleDeclaration> = {
    fontSize: "var(--el-alert-description-font-size)",
    color: "var(--el-color-info)",
    marginLeft: "2px",
    marginRight: "2px",
}

function renderPslLink() {
    return h('a', {
        href: PSL_HOMEPAGE,
        style: pslStyle,
        target: '_blank'
    }, 'Public Suffix List')
}

const _default = defineComponent({
    name: "RuleMergeAlertInfo",
    render() {
        return h(ElAlert,
            { type: 'info', title },
            () => [
                ...liKeys.map(key => h('li', t(msg => msg.mergeRule[key]))),
                h('li', tN(msg => msg.mergeRule.infoAlert5, { psl: renderPslLink() }))
            ]
        )
    }
})

export default _default