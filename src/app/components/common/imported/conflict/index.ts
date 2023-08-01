/**
 * Copyright (c) 2023-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { InfoFilled } from "@element-plus/icons-vue"
import { ElRadio, ElForm, ElFormItem, ElTooltip, ElIcon, ElRadioGroup } from "element-plus"
import { VNode, h, Ref } from "vue"
import "./style.sass"

export const ALL_RESOLUTIONS: timer.imported.ConflictResolution[] = ['overwrite', 'accumulate']

const renderResolutionRadio = (resolution: timer.imported.ConflictResolution): VNode => h(ElRadio,
    { label: resolution },
    () => t(msg => msg.dataManage.importOther[resolution])
)

export const renderResolutionFormItem = (resolution: Ref<timer.imported.ConflictResolution>): VNode => h(ElForm, {
    class: "data-conflit-form",
}, () => h(ElFormItem, {
    required: true,
}, {
    label: () => [
        t(msg => msg.dataManage.importOther.conflictType),
        h(ElTooltip, {
            content: t(msg => msg.dataManage.importOther.conflictTip),
        }, () => h(ElIcon, () => h(InfoFilled)))
    ],
    default: () => h(ElRadioGroup, {
        modelValue: resolution.value,
        onChange: (val: timer.imported.ConflictResolution) => resolution.value = val,
    }, () => ALL_RESOLUTIONS.map(renderResolutionRadio))
}))