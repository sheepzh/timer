/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { SopInstance } from "@app/components/common/DialogSop"
import { t } from "@app/locale"
import { Files } from "@element-plus/icons-vue"
import { ElButton, ElDialog } from "element-plus"
import { defineComponent, ref } from "vue"
import Sop from "./Sop"

const _default = defineComponent({
    setup: () => {
        const dialogVisible = ref(false)
        const sop = ref<SopInstance>()
        const close = () => dialogVisible.value = false

        return () => <>
            <ElButton
                type="primary"
                icon={<Files />}
                onClick={() => dialogVisible.value = true}
            >
                {t(msg => msg.option.backup.download.btn)}
            </ElButton>
            <ElDialog
                alignCenter
                title={t(msg => msg.option.backup.download.btn)}
                width="70%"
                modelValue={dialogVisible.value}
                onOpen={() => sop.value?.init?.()}
                onClose={close}
            >
                <Sop ref={sop} onCancel={close} onDownload={close} />
            </ElDialog>
        </>
    }
})

export default _default