/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import { h, ref } from "vue"
import { ElAlert, ElButton, ElCard, ElLoading, ElMain, ElMessage } from "element-plus"
import { t } from "@app/locale"
import { alertProps } from "./common"
import { deserialize, exportJson } from "@util/file"
import { formatTime } from "@util/time"
import Immigration from "@service/components/immigration"
import { Download, Upload } from "@element-plus/icons-vue"

type _Props = {
    queryData: () => void | Promise<void>
}

const immigration: Immigration = new Immigration()

const handleExport = async () => {
    const data = await immigration.getExportingData()
    const timestamp = formatTime(new Date(), '{y}{m}{d}_{h}{i}{s}')
    exportJson(data, `timer_backup_${timestamp}`)
}

const fileInputRef: Ref<HTMLInputElement> = ref()
const handleFileSelected = async (queryData: () => void) => {
    const files: FileList | null = fileInputRef.value.files
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
    queryData()
    ElMessage.success(t(msg => msg.dataManage.migrated))
}

const alert = () => h(ElAlert, alertProps, () => t(msg => msg.dataManage.migrationAlert))

const exportButtonText = t(msg => msg.item.operation.exportWholeData)
const exportButton = () => h(ElButton,
    {
        size: 'large',
        type: 'success',
        icon: Download,
        onClick: handleExport
    },
    () => exportButtonText
)

const fileInputProps = {
    ref: fileInputRef,
    type: 'file',
    accept: '.json',
    style: { display: 'none' }
}
const fileInput = (queryData: any) => h('input', {
    ...fileInputProps,
    onChange: () => handleFileSelected(queryData)
})
const importButtonText = (queryData: any) => [t(msg => msg.item.operation.importWholeData), fileInput(queryData)]
const importButton = (queryData: any) => h(ElButton,
    {
        size: 'large',
        type: 'primary',
        icon: Upload,
        onClick: () => fileInputRef.value.click()
    },
    () => importButtonText(queryData)
)

const buttonContainer = (queryData: () => void | Promise<void>) => h(ElMain, {},
    () => [alert(), exportButton(), importButton(queryData)]
)

export default (props: _Props) => {
    return h(ElCard, {
        class: 'migration-container'
    },
        () => buttonContainer(props.queryData)
    )
}