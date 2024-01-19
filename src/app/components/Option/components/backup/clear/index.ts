/**
 * Copyright (c) 2023-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Delete } from "@element-plus/icons-vue"
import { ElButton, ElDialog } from "element-plus"
import { defineComponent, Ref, ref, h } from "vue"
import Sop from "./sop"

const _default = defineComponent({
    setup: () => {
        const dialogVisible: Ref<boolean> = ref(false)

        const close = () => dialogVisible.value = false

        return () => [
            h(ElButton, {
                type: 'danger',
                icon: Delete,
                style: { marginRight: '12px' },
                onClick: () => dialogVisible.value = true,
            }, () => t(msg => msg.option.backup.clear.btn)),
            dialogVisible.value && h(ElDialog, {
                alignCenter: true,
                title: t(msg => msg.option.backup.clear.btn),
                width: '70%',
                modelValue: dialogVisible.value,
                onClose: close,
            }, () => h(Sop, {
                onCancel: close,
                onClear: close,
            }))
        ]
    }
})

export default _default