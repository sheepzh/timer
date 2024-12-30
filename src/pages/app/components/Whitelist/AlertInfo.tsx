/**
 * Copyright (c) 2021-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * The label info of whitelist
 *
 * @author zhy
 * @since 0.4.0
 */
import { defineComponent } from "vue"
import { ElAlert } from "element-plus"
import { t } from "@app/locale"

const _default = defineComponent(() => {
    return () => (
        <ElAlert
            title={t(msg => msg.whitelist.infoAlertTitle)}
            style={{ padding: "15px 25px" }}
            closable={false}
        >
            <li>{t(msg => msg.whitelist.infoAlert0)}</li>
            <li>{t(msg => msg.whitelist.infoAlert1)}</li>
        </ElAlert>
    )
})

export default _default