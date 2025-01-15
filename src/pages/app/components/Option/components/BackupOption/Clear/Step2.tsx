/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { ElAlert } from "element-plus"
import { defineComponent, type PropType } from "vue"
import { type StatResult } from "./Step1"

const _default = defineComponent({
    props: {
        data: Object as PropType<StatResult>,
    },
    setup(props) {
        return () => (
            <ElAlert type="success" closable={false}>
                {t(msg => msg.option.backup.clear.confirmTip, {
                    ...props.data,
                    clientName: props.data?.client?.name || ''
                })}
            </ElAlert>
        )
    }
})

export default _default