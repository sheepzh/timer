/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Download } from "@element-plus/icons-vue"
import Immigration from "@service/components/immigration"
import { exportJson } from "@util/file"
import { formatTime } from "@util/time"
import { ElAlert, ElButton, ElCard, ElMain } from "element-plus"
import { defineComponent } from "vue"
import { alertProps } from "../common"
import ImportButton from "./ImportButton"
import ImportOtherButton from "./ImportOtherButton"

const immigration: Immigration = new Immigration()

async function handleExport() {
    const data = await immigration.getExportingData()
    const timestamp = formatTime(new Date(), '{y}{m}{d}_{h}{i}{s}')
    exportJson(data, `timer_backup_${timestamp}`)
}

const _default = defineComponent({
    emits: {
        import: () => true
    },
    setup(_, ctx) {
        const handleImported = () => ctx.emit("import")
        return () => (
            <ElCard class="migration-container">
                <ElMain>
                    <ElAlert {...alertProps} >
                        {t(msg => msg.dataManage.migrationAlert)}
                    </ElAlert>
                    <ElButton size="large" type="success" icon={<Download />} onClick={handleExport}>
                        {t(msg => msg.item.operation.exportWholeData)}
                    </ElButton>
                    <ImportButton onImport={handleImported} />
                    <ImportOtherButton onImport={handleImported} />
                </ElMain>
            </ElCard>
        )
    }
})

export default _default
