/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import CompareTable from "@app/components/common/imported/CompareTable"
import { renderResolutionFormItem } from "@app/components/common/imported/conflict"
import { t } from "@app/locale"
import { Back, Check } from "@element-plus/icons-vue"
import { useManualRequest } from "@hooks"
import { processImportedData } from "@service/components/import-processor"
import { ElAlert, ElButton, ElMessage } from "element-plus"
import { type PropType, type Ref, defineComponent, ref } from "vue"

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

        const { refresh: download, loading: downloading } = useManualRequest(
            (resolution: timer.imported.ConflictResolution) => processImportedData(props.data, resolution),
            {
                onSuccess: () => {
                    ElMessage.success(t(msg => msg.operation.successMsg))
                    ctx.emit('download')
                }
            })

        const handleDownload = () => {
            const resolutionVal = resolution.value
            if (!resolutionVal) {
                ElMessage.warning(t(msg => msg.dataManage.importOther.conflictNotSelected))
                return
            }
            download(resolutionVal)
        }

        return () => <>
            <ElAlert type="success" closable={false}>
                {
                    t(msg => msg.option.backup.download.confirmTip, {
                        clientName: props.clientName,
                        size: props.data?.rows?.length || 0
                    })
                }
            </ElAlert>
            <CompareTable data={props.data} comparedColName={t(msg => msg.option.backup.download.willDownload)} />
            <div class="resolution-container">
                {renderResolutionFormItem(resolution)}
            </div>
            <div class="sop-footer">
                <ElButton type="info" icon={<Back />} disabled={downloading.value} onClick={() => ctx.emit("back")}>
                    {t(msg => msg.button.previous)}
                </ElButton>
                <ElButton type="success" icon={<Check />} loading={downloading.value} onClick={handleDownload}>
                    {t(msg => msg.button.confirm)}
                </ElButton>
            </div>
        </>
    }
})

export default _default
