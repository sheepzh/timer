/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, Ref } from "vue"

import { h, ref } from "vue"
import { ElAlert, ElButton, ElCard, ElLoading, ElMain, ElMessage } from "element-plus"
import { t } from "@app/locale"
import { alertProps } from "./common"
import { deserialize, exportJson } from "@util/file"
import { formatTime } from "@util/time"
import Immigration from "@service/components/immigration"
import { Download, Upload } from "@element-plus/icons-vue"

const immigration: Immigration = new Immigration()

async function handleExport() {
    const data = await immigration.getExportingData()
    const timestamp = formatTime(new Date(), '{y}{m}{d}_{h}{i}{s}')
    exportJson(data, `timer_backup_${timestamp}`)
}

async function handleFileSelected(fileInputRef: Ref, callback: () => void) {
    const files: FileList | null = fileInputRef?.value?.files
    if (!files || !files.length) {
        return
    }
    const loading = ElLoading.service({ fullscreen: true })
    const file: File = files[0]
    const fileText = await file.text()
    const data = deserialize(fileText)
    if (!data) {
        ElMessage.error(t(msg => msg.dataManage.importError))
    }
    await immigration.importData(data)
    loading.close()
    callback?.()
    ElMessage.success(t(msg => msg.dataManage.migrated))
}

const exportButtonText = t(msg => msg.item.operation.exportWholeData)

const _default = defineComponent({
    name: "Migration",
    emits: {
        import: () => true
    },
    setup(_, ctx) {
        const fileInputRef: Ref<HTMLInputElement> = ref()
        return () => h(ElCard, { class: 'migration-container' }, () => h(ElMain, {}, () => [
            h(ElAlert, alertProps, () => t(msg => msg.dataManage.migrationAlert)),
            h(ElButton, {
                size: 'large',
                type: 'success',
                icon: Download,
                onClick: handleExport
            }, () => exportButtonText),
            h(ElButton, {
                size: 'large',
                type: 'primary',
                icon: Upload,
                onClick: () => fileInputRef.value.click()
            }, () => [
                t(msg => msg.item.operation.importWholeData),
                h('input', {
                    ref: fileInputRef,
                    type: 'file',
                    accept: '.json',
                    style: { display: 'none' },
                    onChange: () => handleFileSelected(fileInputRef, () => ctx.emit('import'))
                })
            ])
        ]))
    }
})

export default _default