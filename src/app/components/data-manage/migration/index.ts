/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent } from "vue"

import { h } from "vue"
import { ElAlert, ElButton, ElCard, ElMain } from "element-plus"
import { t } from "@app/locale"
import { alertProps } from "../common"
import { exportJson } from "@util/file"
import { formatTime } from "@util/time"
import Immigration from "@service/components/immigration"
import { Download } from "@element-plus/icons-vue"
import ImportButton from "./import-button"
import ImportOtherButton from "./import-other-button"

const immigration: Immigration = new Immigration()

async function handleExport() {
    const data = await immigration.getExportingData()
    const timestamp = formatTime(new Date(), '{y}{m}{d}_{h}{i}{s}')
    exportJson(data, `timer_backup_${timestamp}`)
}

const exportButtonText = t(msg => msg.item.operation.exportWholeData)

const _default = defineComponent({
    name: "Migration",
    emits: {
        import: () => true
    },
    setup(_, ctx) {
        return () => h(ElCard, { class: 'migration-container' }, () => h(ElMain, {}, () => [
            h(ElAlert, alertProps, () => t(msg => msg.dataManage.migrationAlert)),
            h(ElButton, {
                size: 'large',
                type: 'success',
                icon: Download,
                onClick: handleExport
            }, () => exportButtonText),
            h(ImportButton, { onImport: () => ctx.emit('import') }),
            h(ImportOtherButton, { onImport: () => ctx.emit('import') }),
        ]))
    }
})

export default _default