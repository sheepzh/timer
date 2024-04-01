/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { ElButton, ElMessage } from "element-plus"
import { PropType, Ref, defineComponent, ref } from "vue"
import { Back, Check } from "@element-plus/icons-vue"
import { processImportedData } from "@service/components/import-processor"
import { renderResolutionFormItem } from "@app/components/common/imported/conflict"
import CompareTable from "@app/components/common/imported/CompareTable"

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
        const importing = ref<boolean>(false)

        const handleImport = () => {
            const resolutionVal = resolution.value
            if (!resolutionVal) {
                ElMessage.warning(t(msg => msg.dataManage.importOther.conflictNotSelected))
                return
            }
            importing.value = true
            processImportedData(props.data, resolutionVal)
                .then(() => {
                    ElMessage.success(t(msg => msg.dataManage.migrated))
                    ctx.emit('import')
                })
                .catch(e => ElMessage.error(e))
                .finally(() => importing.value = false)
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
                <ElButton type="success" icon={<Check />} loading={importing.value} onClick={handleImport}>
                    {t(msg => msg.button.confirm)}
                </ElButton>
            </div>
        </>
    }
})

export default _default
