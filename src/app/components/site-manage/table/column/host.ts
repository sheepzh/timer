/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn } from "element-plus"
import { HostAliasInfo } from "@entity/dto/host-alias-info"
import HostAlert from "@app/components/common/host-alert"
import { h } from "vue"
import { t } from "@app/locale"

const columnProps = {
    prop: 'host',
    label: t(msg => msg.siteManage.column.host),
    minWidth: 120,
    align: 'center',
}

const slots = { default: ({ row }: { row: HostAliasInfo }) => h(HostAlert, { host: row.host, iconUrl: row.iconUrl }) }

const _default = () => h(ElTableColumn, columnProps, slots)

export default _default