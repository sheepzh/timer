/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { InfoFilled } from "@element-plus/icons-vue"
import Flex from "@pages/components/Flex"
import { ElForm, ElFormItem, ElIcon, ElRadio, ElRadioGroup, ElTooltip } from "element-plus"
import { defineComponent, type PropType } from "vue"

export const ALL_RESOLUTIONS: timer.imported.ConflictResolution[] = ['overwrite', 'accumulate']

const ResolutionRadio = defineComponent({
    props: {
        modelValue: String as PropType<timer.imported.ConflictResolution>,
    },
    emits: {
        change: (_val: timer.imported.ConflictResolution | undefined) => true,
    },
    setup(props, ctx) {
        return () => (
            <ElForm>
                <ElFormItem
                    required
                    style={{ margin: 0, display: 'flex', gap: '28px' }}
                    v-slots={{
                        label: () => (
                            <Flex align="center" gap={2}>
                                {t(msg => msg.dataManage.importOther.conflictType)}
                                <ElTooltip content={t(msg => msg.dataManage.importOther.conflictTip)}>
                                    <ElIcon>
                                        <InfoFilled />
                                    </ElIcon>
                                </ElTooltip>
                            </Flex>
                        )
                    }}
                >
                    <ElRadioGroup
                        modelValue={props.modelValue}
                        onChange={val => ctx.emit('change', val as timer.imported.ConflictResolution | undefined)}
                    >
                        {ALL_RESOLUTIONS.map((resolution: timer.imported.ConflictResolution) => (
                            <ElRadio value={resolution}>
                                {t(msg => msg.dataManage.importOther[resolution])}
                            </ElRadio>
                        ))}
                    </ElRadioGroup>
                </ElFormItem>
            </ElForm>
        )
    }
})

export default ResolutionRadio