/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElAlert } from "element-plus"
import { t, tN } from "@app/locale"
import { StyleValue, defineComponent } from "vue"
import { PSL_HOMEPAGE } from "@util/constant/url"

const pslStyle: StyleValue = {
    fontSize: "var(--el-alert-description-font-size)",
    color: "var(--el-color-info)",
    marginLeft: "2px",
    marginRight: "2px",
}

const _default = defineComponent(() => {
    return () => (
        <ElAlert
            type="info"
            title={t(msg => msg.mergeRule.infoAlertTitle)}
            style={{ padding: "15px 25px" }}
            closable={false}
        >
            <li>{t(msg => msg.mergeRule.infoAlert0)}</li>
            <li>{t(msg => msg.mergeRule.infoAlert1)}</li>
            <li>{t(msg => msg.mergeRule.infoAlert2)}</li>
            <li>{t(msg => msg.mergeRule.infoAlert3)}</li>
            <li>{t(msg => msg.mergeRule.infoAlert4)}</li>
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