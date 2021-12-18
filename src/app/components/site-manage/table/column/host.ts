/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn } from "element-plus"
import { host2ElLink } from "../../../../../app/components/common/table"
import { HostAliasInfo } from "../../../../../entity/dto/host-alias-info"
import { h } from "vue"
import { t } from "../../../../locale"

const columnProps = {
    prop: 'host',
    label: t(msg => msg.siteManage.column.host),
    minWidth: 120,
    align: 'center',
}

const slots = { default: ({ row }: { row: HostAliasInfo }) => host2ElLink(row.host, row.iconUrl) }

const _default = () => h(ElTableColumn, columnProps, slots)

export default _default