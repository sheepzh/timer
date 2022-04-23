/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElAlert } from "element-plus"
import { t } from "@app/locale"
import { defineComponent, h } from "vue"
import { MergeRuleMessage } from "@app/locale/components/merge-rule"

const liKeys: (keyof MergeRuleMessage)[] = ['infoAlert0', 'infoAlert1', 'infoAlert2', 'infoAlert3', 'infoAlert4', 'infoAlert5']
const title = t(msg => msg.mergeRule.infoAlertTitle)

const _default = defineComponent({
    name: "RuleMergeAlertInfo",
    render() {
        return h(ElAlert,
            { type: 'info', title },
            () => liKeys.map(key => h('li', t(msg => msg.mergeRule[key])))
        )
    }
})

export default _default