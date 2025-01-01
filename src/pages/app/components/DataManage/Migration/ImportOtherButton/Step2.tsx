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
import { ElButton, ElMessage } from "element-plus"
import { type PropType, defineComponent, ref } from "vue"

const _default = defineComponent({
    props: {
        data: Object as PropType<timer.imported.Data>
    },
    emits: {
        back: () => true,
        import: () => true,
    },
    setup(props, ctx) {
        const resolution = ref<timer.imported.ConflictResolution>()

        const { loading: importing, refresh: doImport } = useManualRequest(
            (resolution: timer.imported.ConflictResolution) => processImportedData(props.data, resolution),
            {
                onSuccess: () => {
                    ElMessage.success(t(msg => msg.operation.successMsg))
                    ctx.emit('import')
                },
                onError: (e) => ElMessage.error(e),
            }
        )

        const handleImport = () => {
            const resolutionVal = resolution.value
            if (resolutionVal) {
                doImport(resolutionVal)
                return
            }
            ElMessage.warning(t(msg => msg.dataManage.importOther.conflictNotSelected))
        }

        return () => <>
            <CompareTable
                data={props.data}
                comparedColName={t(msg => msg.dataManage.importOther.imported)}
            />
            <div class="resolution-container">
                {renderResolutionFormItem(resolution)}
            </div>
            <div class="sop-footer">
                <ElButton
                    type="info"
                    icon={<Back />}
                    disabled={importing.value}
                    onClick={() => ctx.emit("back")}
                >
                    {t(msg => msg.button.previous)}
                </ElButton>
                <ElButton
                    type="success"
                    icon={<Check />}
                    loading={importing.value}
                    onClick={handleImport}
                >
                    {t(msg => msg.button.confirm)}
                </ElButton>
            </div>
        </>
    }
})

export default _default
