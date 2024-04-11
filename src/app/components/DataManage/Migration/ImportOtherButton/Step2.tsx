/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { ElButton, ElMessage } from "element-plus"
import { PropType, defineComponent, ref } from "vue"
import { Back, Check } from "@element-plus/icons-vue"
import { processImportedData } from "@service/components/import-processor"
import { renderResolutionFormItem } from "@app/components/common/imported/conflict"
import CompareTable from "@app/components/common/imported/CompareTable"
import { useRequest } from "@hooks"

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

        const { loading: importing, refresh: doImport } = useRequest(() => {
            const resolutionVal = resolution.value
            if (!resolutionVal) {
                return ElMessage.warning(t(msg => msg.dataManage.importOther.conflictNotSelected))
            }

            processImportedData(props.data, resolutionVal)
                .then(() => {
                    ElMessage.success(t(msg => msg.operation.successMsg))
                    ctx.emit('import')
                })
                .catch(e => ElMessage.error(e))
        }, { manual: true })

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
                <ElButton type="success" icon={<Check />} loading={importing.value} onClick={doImport}>
                    {t(msg => msg.button.confirm)}
                </ElButton>
            </div>
        </>
    }
})

export default _default
