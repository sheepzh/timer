/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn, ElTag } from "element-plus"
import { h } from "vue"
import HostAlias, { HostAliasSource } from "@entity/dao/host-alias"
import { I18nKey, t } from "@app/locale"

const columnProps = {
    prop: 'source',
    label: t(msg => msg.siteManage.column.source),
    minWidth: 70,
    align: 'center',
}

const SOURCE_I18N_KEY: { [source in HostAliasSource]: I18nKey } = {
    USER: msg => msg.siteManage.source.user,
    DETECTED: msg => msg.siteManage.source.detected
}

function renderSource(source: HostAliasSource) {
    const type = source === HostAliasSource.USER ? '' : 'info'
    return h(ElTag, { type, size: 'mini' }, () => t(SOURCE_I18N_KEY[source]))
}

const slots = { default: ({ row }: { row: HostAlias }) => renderSource(row.source) }

const _default = () => h(ElTableColumn, columnProps, slots)

export default _default