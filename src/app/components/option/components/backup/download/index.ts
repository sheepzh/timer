/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Files } from "@element-plus/icons-vue"
import { ElButton, ElDialog } from "element-plus"
import { defineComponent, Ref, ref, h } from "vue"
import Sop from "./sop"

const _default = defineComponent({
    setup: () => {
        const dialogVisible: Ref<boolean> = ref(false)

        const close = () => dialogVisible.value = false

        return () => [
            h(ElButton, {
                type: 'primary',
                icon: Files,
                style: { marginRight: '12px' },
                onClick: () => dialogVisible.value = true,
            }, () => t(msg => msg.option.backup.download.btn)),
            dialogVisible.value && h(ElDialog, {
                alignCenter: true,
                title: t(msg => msg.option.backup.download.btn),
                width: '70%',
                modelValue: dialogVisible.value,
                onClose: close,
            }, () => h(Sop, {
                onCancel: close,
                onDownload: close,
            }))
        ]
    }
})

export default _default