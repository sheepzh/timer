/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElIcon, ElTableColumn, ElTooltip } from "element-plus"
import { HostAliasInfo } from "@entity/dto/host-alias-info"
import { h } from "vue"
import { t } from "@app/locale"
import { InfoFilled } from "@element-plus/icons"

const columnProps = {
    prop: 'host',
    minWidth: 100,
    align: 'center',
}

const slots = {
    default: ({ row }: { row: HostAliasInfo }) => h('span', row.name),
    header: () => {
        const infoTooltip = h(ElTooltip,
            { content: t(msg => msg.siteManage.column.aliasInfo), placement: 'top' },
            () => h(ElIcon, { size: 11 }, () => h(InfoFilled))
        )
        return [t(msg => msg.siteManage.column.alias), ' ', infoTooltip]
    }
}

const _default = () => h(ElTableColumn, columnProps, slots)

export default _default