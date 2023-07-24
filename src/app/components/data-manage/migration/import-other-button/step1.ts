import { t } from "@app/locale"
import { ElButton, ElForm, ElFormItem, ElMessage, ElOption, ElSelect } from "element-plus"
import { Ref, defineComponent, h, ref } from "vue"
import { Document, Close, Right } from "@element-plus/icons-vue"
import { ImportedData, OtherExtension, parseFile } from "./processor"

const OTHER_NAMES: { [ext in OtherExtension]: string } = {
    webtime_tracker: "Webtime Tracker",
    web_activity_time_tracker: "Web Activity Time Tracker"
}

const OTHER_FILE_FORMAT: { [ext in OtherExtension]: string } = {
    webtime_tracker: '.csv,.json',
    web_activity_time_tracker: '.csv',
}

const ALL_TYPES: OtherExtension[] = Object.keys(OTHER_NAMES) as OtherExtension[]

const _default = defineComponent({
    emits: {
        cancel: () => true,
        next: (_rows: ImportedData) => true,
    },
    setup(_, ctx) {
        const type: Ref<OtherExtension> = ref('webtime_tracker')
        const selectedFile: Ref<File> = ref()
        const fileInput: Ref<HTMLInputElement> = ref()
        const fileParsing: Ref<boolean> = ref(false)

        const handleNext = () => {
            const file = selectedFile.value
            if (!file) {
                ElMessage.warning(t(msg => msg.dataManage.importOther.fileNotSelected))
                return
            }
            fileParsing.value = true
            parseFile(type.value, selectedFile.value)
                .then(data => data?.rows?.length ? ctx.emit('next', data) : ElMessage.error("No rows parsed"))
                .catch((e: Error) => ElMessage.error(e.message))
                .finally(() => fileParsing.value = false)
        }

        return () => [
            h(ElForm, {
                labelWidth: 100,
                class: "import-other-form",
                labelPosition: 'left',
            }, () => [
                h(ElFormItem, {
                    label: t(msg => msg.dataManage.importOther.dataSource),
                    required: true,
                }, () => h(ElSelect, {
                    modelValue: type.value,
                    onChange: (val: OtherExtension) => type.value = val,
                }, () => ALL_TYPES.map(type => h(ElOption, { value: type, label: OTHER_NAMES[type] })))),
                h(ElFormItem,
                    { label: t(msg => msg.dataManage.importOther.file), required: true },
                    () => [
                        h(ElButton, {
                            icon: Document,
                            onClick: () => fileInput.value?.click()
                        }, () => [
                            t(msg => msg.dataManage.importOther.selectFileBtn),
                            h('input', {
                                ref: fileInput,
                                type: 'file',
                                accept: OTHER_FILE_FORMAT[type.value],
                                style: { display: 'none' },
                                onChange: () => selectedFile.value = fileInput.value?.files?.[0],
                            })
                        ]),
                        selectedFile.value?.name && h('span', { class: 'select-import-file-name' }, selectedFile.value?.name),
                    ]
                )
            ]),
            h('div', { class: 'sop-footer' }, [
                h(ElButton, {
                    type: 'info',
                    icon: Close,
                    onClick: () => ctx.emit('cancel'),
                }, () => t(msg => msg.button.cancel)),
                h(ElButton, {
                    type: 'primary',
                    icon: Right,
                    loading: fileParsing.value,
                    onClick: handleNext
                }, () => t(msg => msg.button.next)),
            ]),
        ]
    }
})

export default _default