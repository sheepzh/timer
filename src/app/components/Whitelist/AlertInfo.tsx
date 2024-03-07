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
import { WhitelistMessage } from "@i18n/message/app/whitelist"

const liKeys: (keyof WhitelistMessage)[] = ['infoAlert0', 'infoAlert1']

const _default = defineComponent(() => {
    return () => (
        <ElAlert title={t(msg => msg.whitelist.infoAlertTitle)}>
            {
                liKeys.map(k => <li>{t(msg => msg.whitelist[k])}</li>)
            }
        </ElAlert>
    )
})

export default _default