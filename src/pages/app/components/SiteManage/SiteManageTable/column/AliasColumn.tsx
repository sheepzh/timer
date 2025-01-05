/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import ColumnHeader from "@app/components/common/ColumnHeader"
import Editable from "@app/components/common/Editable"
import { t } from "@app/locale"
import { MagicStick } from "@element-plus/icons-vue"
import Flex from "@pages/components/Flex"
import siteService from "@service/site-service"
import { identifySiteKey } from "@util/site"
import { ElIcon, ElTableColumn, ElText, ElTooltip } from "element-plus"
import { defineComponent } from "vue"

const _default = defineComponent({
    emits: {
        rowAliasSaved: (_row: timer.site.SiteInfo) => true,
    },
    setup: (_, ctx) => {
        const handleChange = async (newAlias: string, row: timer.site.SiteInfo) => {
            newAlias = newAlias?.trim?.()
            row.alias = newAlias
            row.source = 'USER'
            if (newAlias) {
                await siteService.saveAlias(row, newAlias, "USER")
            } else {
                await siteService.removeAlias(row)
            }
            ctx.emit("rowAliasSaved", row)
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
                        key={`${identifySiteKey(row)}_${row.source}_${row.alias}`}
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