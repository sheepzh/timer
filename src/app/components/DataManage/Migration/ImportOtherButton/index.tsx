/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Upload } from "@element-plus/icons-vue"
import { useSwitch } from "@hooks"
import { ElButton, ElDialog } from "element-plus"
import { defineComponent } from "vue"
import Sop from "./Sop"
import "./style"

const _default = defineComponent({
    emits: {
        import: () => true
    },
    setup(_) {
        const [visible, open, close] = useSwitch()
        return () => <>
            <ElButton size="large" type="warning" icon={<Upload />} onClick={open}>
                {t(msg => msg.item.operation.importOtherData)}
            </ElButton>
            <ElDialog
                top="10vh"
                class="sop-dialog"
                modelValue={visible.value}
                title={t(msg => msg.item.operation.importOtherData)}
                width="80%"
                closeOnClickModal={false}
            >
                <Sop onCancel={close} onImport={close} />
            </ElDialog>
        </>
    }
})

export default _default