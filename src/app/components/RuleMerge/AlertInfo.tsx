/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElAlert } from "element-plus"
import { t, tN } from "@app/locale"
import { StyleValue, defineComponent } from "vue"
import { MergeRuleMessage } from "@i18n/message/app/merge-rule"
import { PSL_HOMEPAGE } from "@util/constant/url"

const liKeys: (keyof MergeRuleMessage)[] = ['infoAlert0', 'infoAlert1', 'infoAlert2', 'infoAlert3', 'infoAlert4']

const pslStyle: StyleValue = {
    fontSize: "var(--el-alert-description-font-size)",
    color: "var(--el-color-info)",
    marginLeft: "2px",
    marginRight: "2px",
}

const _default = defineComponent({
    render: () => (
        <ElAlert type="info" title={t(msg => msg.mergeRule.infoAlertTitle)}>
            {liKeys.map(key => <li>{t(msg => msg.mergeRule[key])}</li>)}
            <li>
                {
                    tN(msg => msg.mergeRule.infoAlert5, {
                        psl: <a href={PSL_HOMEPAGE} style={pslStyle} target="_blank" >Public Suffix List</a>
                    })
                }
            </li>
        </ElAlert>
    )
})

export default _default