import { t } from "@app/locale"
import { Upload } from "@element-plus/icons-vue"
import { ElButton, ElDialog } from "element-plus"
import { Ref, defineComponent, h, ref } from "vue"
import Sop from "./sop"
import "./style"

const _default = defineComponent({
    emits: {
        import: () => true
    },
    setup(_) {
        const dialogVisible: Ref<boolean> = ref(false)
        const close = () => dialogVisible.value = false
        return () => [
            h(ElButton, {
                size: 'large',
                type: 'warning',
                icon: Upload,
                onClick: () => dialogVisible.value = true
            }, () => t(msg => msg.item.operation.importOtherData)),
            h(ElDialog, {
                top: '10vh',
                modelValue: dialogVisible.value,
                title: t(msg => msg.item.operation.importOtherData),
                width: '80%',
                closeOnClickModal: false,
            }, () => h(Sop, {
                onCancel: close,
                onImport: close,
            }))
        ]
    }
})

export default _default