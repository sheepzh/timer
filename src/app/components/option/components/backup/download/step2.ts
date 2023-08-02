/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { ElAlert, ElButton, ElMessage } from "element-plus"
import { PropType, Ref, defineComponent, h, ref } from "vue"
import { Back, Check } from "@element-plus/icons-vue"
import { processImportedData } from "@service/components/import-processor"
import { renderResolutionFormItem } from "@app/components/common/imported/conflict"
import CompareTable from "@app/components/common/imported/comapre-table"

const _default = defineComponent({
    props: {
        data: Object as PropType<timer.imported.Data>,
        clientName: {
            type: String,
            required: true,
        }
    },
    emits: {
        back: () => true,
        download: () => true,
    },
    setup(props, ctx) {
        const resolution: Ref<timer.imported.ConflictResolution> = ref()
        const downloading: Ref<boolean> = ref(false)

        const handleDownload = () => {
            const resolutionVal = resolution.value
            if (!resolutionVal) {
                ElMessage.warning(t(msg => msg.dataManage.importOther.conflictNotSelected))
                return
            }
            downloading.value = true
            processImportedData(props.data, resolutionVal)
                .then(() => {
                    ElMessage.success(t(msg => msg.operation.successMsg))
                    ctx.emit('download')
                })
                .catch()
                .finally(() => downloading.value = false)
        }

        return () => [
            h(ElAlert, {
                type: 'success',
                closable: false,
            }, () => t(msg => msg.option.backup.download.confirmTip, {
                clientName: props.clientName,
                size: props.data?.rows?.length || 0
            })),
            h(CompareTable, {
                data: props.data,
                comparedColName: t(msg => msg.option.backup.download.willDownload),
            }),
            h('div', { class: 'resolution-container' }, renderResolutionFormItem(resolution)),
            h('div', { class: 'sop-footer' }, [
                h(ElButton, {
                    type: 'info',
                    icon: Back,
                    disabled: downloading.value,
                    onClick: () => ctx.emit('back'),
                }, () => t(msg => msg.button.previous)),
                h(ElButton, {
                    type: 'success',
                    icon: Check,
                    loading: downloading.value,
                    onClick: handleDownload
                }, () => t(msg => msg.button.confirm)),
            ]),
        ]
    }
})

export default _default
