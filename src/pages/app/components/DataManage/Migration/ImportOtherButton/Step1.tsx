/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Close, Document, Right } from "@element-plus/icons-vue"
import { useState, useSwitch } from "@hooks"
import { ElButton, ElForm, ElFormItem, ElMessage, ElOption, ElSelect } from "element-plus"
import { defineComponent, ref } from "vue"
import { type OtherExtension, parseFile } from "./processor"

const OTHER_NAMES: { [ext in OtherExtension]: string } = {
    webtime_tracker: "Webtime Tracker",
    web_activity_time_tracker: "Web Activity Time Tracker",
    history_trends_unlimited: "History Trends Unlimited",
}

const OTHER_FILE_FORMAT: { [ext in OtherExtension]: string } = {
    webtime_tracker: '.csv,.json',
    web_activity_time_tracker: '.csv',
    history_trends_unlimited: '.tsv',
}

const ALL_TYPES: OtherExtension[] = Object.keys(OTHER_NAMES) as OtherExtension[]

const _default = defineComponent({
    emits: {
        cancel: () => true,
        next: (_rows: timer.imported.Data) => true,
    },
    setup(_, ctx) {
        const [type, setType] = useState<OtherExtension>('webtime_tracker')
        const [selectedFile, setSelectedFile] = useState<File>()
        const fileInput = ref<HTMLInputElement>()
        const [parsing, startParse, endParse] = useSwitch()

        const handleNext = () => {
            const file = selectedFile.value
            if (!file) {
                ElMessage.warning(t(msg => msg.dataManage.importOther.fileNotSelected))
                return
            }
            startParse()
            parseFile(type.value, selectedFile.value)
                .then(data => data?.rows?.length ? ctx.emit('next', data) : ElMessage.error("No rows parsed"))
                .catch((e: Error) => ElMessage.error(e.message))
                .finally(endParse)
        }
        return () => <>
            <ElForm labelWidth={100} class="import-other-form" labelPosition="left">
                <ElFormItem label={t(msg => msg.dataManage.importOther.dataSource)} required>
                    <ElSelect modelValue={type.value} onChange={setType}>
                        {
                            ALL_TYPES.map(type => <ElOption value={type} label={OTHER_NAMES[type]} />)
                        }
                    </ElSelect>
                </ElFormItem>
                <ElFormItem label={t(msg => msg.dataManage.importOther.file)} required>
                    <ElButton icon={<Document />} onClick={() => fileInput.value?.click?.()}>
                        {t(msg => msg.dataManage.importOther.selectFileBtn)}
                        <input
                            ref={fileInput}
                            type="file"
                            accept={OTHER_FILE_FORMAT[type.value]}
                            style={{ display: 'none' }}
                            onChange={() => setSelectedFile(fileInput.value?.files?.[0])}
                        />
                    </ElButton>
                    {selectedFile.value?.name && <span class="select-import-file-name">{selectedFile.value?.name}</span>}
                </ElFormItem>
            </ElForm>
            <div class="sop-footer">
                <ElButton type="info" icon={<Close />} onClick={() => ctx.emit('cancel')}>
                    {t(msg => msg.button.cancel)}
                </ElButton>
                <ElButton type="primary" icon={<Right />} loading={parsing.value} onClick={handleNext}>
                    {t(msg => msg.button.next)}
                </ElButton>
            </div>
        </>
    }
})

export default _default