/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import ColumnHeader from "@app/components/common/ColumnHeader"
import Editable from "@app/components/common/Editable"
import Flex from "@app/components/common/Flex"
import { t } from "@app/locale"
import { MagicStick } from "@element-plus/icons-vue"
import siteService from "@service/site-service"
import { ElIcon, ElTableColumn, ElText, ElTooltip } from "element-plus"
import { defineComponent } from "vue"

const _default = defineComponent({
    emits: {
        rowAliasSaved: (_row: timer.site.SiteInfo, _newAlias: string) => true,
    },
    setup: (_, ctx) => {
        const handleChange = async (newAlias: string, row: timer.site.SiteInfo) => {
            newAlias = newAlias?.trim?.()
            row.alias = newAlias
            if (newAlias) {
                await siteService.saveAlias(row, newAlias, "USER")
            } else {
                await siteService.removeAlias(row)
            }
            ctx.emit("rowAliasSaved", row, newAlias)
        }

        return () => (
            <ElTableColumn
                minWidth={160}
                align="center"
                v-slots={{
                    header: () => <ColumnHeader
                        label={t(msg => msg.siteManage.column.alias)}
                        tooltipContent={t(msg => msg.siteManage.column.aliasInfo)}
                    />,
                    default: ({ row }: { row: timer.site.SiteInfo }) => <Editable
                        modelValue={row.alias}
                        onChange={val => handleChange(val, row)}
                        v-slots={{
                            label: (val: string) => (
                                <Flex align="center" gap={3}>
                                    {row.source === 'DETECTED' && val && (
                                        <ElTooltip
                                            content={t(msg => msg.siteManage.detected)}
                                            placement="top"
                                        >
                                            <ElText size="small" type="primary" style={{ cursor: 'pointer' }}>
                                                <ElIcon style={{ transform: 'rotateY(180deg)' }}>
                                                    <MagicStick />
                                                </ElIcon>
                                            </ElText>
                                        </ElTooltip>
                                    )}
                                    <span>{val}</span>
                                </Flex>
                            )
                        }}
                    />,
                }}
            />
        )
    }
})

export default _default