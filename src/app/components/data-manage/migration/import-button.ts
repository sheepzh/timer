/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Upload } from "@element-plus/icons-vue"
import Immigration from "@service/components/immigration"
import { deserialize } from "@util/file"
import { ElButton, ElLoading, ElMessage } from "element-plus"
import { Ref, defineComponent, h, ref } from "vue"

const immigration: Immigration = new Immigration()

async function handleFileSelected(fileInputRef: Ref<HTMLInputElement>, callback: () => void) {
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

const _default = defineComponent({
    emits: {
        import: () => true
    },
    setup(_, ctx) {
        const fileInputRef = ref<HTMLInputElement>()
        return () => h(ElButton, {
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
    }
})

export default _default
