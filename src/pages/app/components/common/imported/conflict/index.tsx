/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { InfoFilled } from "@element-plus/icons-vue"
import { ElForm, ElFormItem, ElIcon, ElRadio, ElRadioGroup, ElTooltip } from "element-plus"
import { type Ref, type VNode } from "vue"
import "./style.sass"

export const ALL_RESOLUTIONS: timer.imported.ConflictResolution[] = ['overwrite', 'accumulate']

const renderResolutionRadio = (resolution: timer.imported.ConflictResolution): VNode => (
    <ElRadio label={resolution}>
        {t(msg => msg.dataManage.importOther[resolution])}
    </ElRadio>
)

export const renderResolutionFormItem = (resolution: Ref<timer.imported.ConflictResolution>): VNode => (
    <ElForm class="data-conflict-form">
        <ElFormItem required v-slots={{
            label: () => <>
                {t(msg => msg.dataManage.importOther.conflictType)}
                <ElTooltip content={t(msg => msg.dataManage.importOther.conflictTip)}>
                    <ElIcon>
                        <InfoFilled />
                    </ElIcon>
                </ElTooltip>
            </>
        }}>
            <ElRadioGroup
                modelValue={resolution.value}
                onChange={(val: timer.imported.ConflictResolution) => resolution.value = val}
            >
                {ALL_RESOLUTIONS.map(renderResolutionRadio)}
            </ElRadioGroup>
        </ElFormItem>
    </ElForm>
)