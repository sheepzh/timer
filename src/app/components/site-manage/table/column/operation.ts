/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElButton, ElPopconfirm, ElTableColumn } from "element-plus"
import { t } from "../../../../../app/locale"
import { h } from "vue"
import { HostAliasInfo } from "../../../../../entity/dto/host-alias-info"
import { Delete, Edit } from "@element-plus/icons"
import { QueryData } from "../../../../../app/components/common/constants"

type _Props = {
    handleDelete: (row: HostAliasInfo) => Promise<void>
    handleModify: (row: HostAliasInfo) => Promise<void>
    queryData: QueryData
}

export type OperationButtonColumnProps = _Props

const deleteButton = (props: _Props, row: HostAliasInfo) => {
    const popConfirmProps = {
        confirmButtonText: t(msg => msg.confirm.confirmMsg),
        cancelButtonText: t(msg => msg.confirm.cancelMsg),
        title: t(msg => msg.siteManage.deleteConfirmMsg, { host: row.host }),
        onConfirm: async () => {
            await props.handleDelete(row)
            await props.queryData()
        }
    }
    const reference = () => h<{}>(ElButton, {
        size: 'mini',
        type: "danger",
        icon: Delete
    }, () => t(msg => msg.siteManage.button.delete))
    return h(ElPopconfirm, popConfirmProps, { reference })
}

const modifyButton = (props: _Props, row: HostAliasInfo) => {
    return h(ElButton, {
        size: 'mini',
        type: "primary",
        icon: Edit,
        onClick: () => props.handleModify(row)
    }, () => t(msg => msg.siteManage.button.modify))
}

const tableColumnProps = {
    label: t(msg => msg.item.operation.label),
    align: 'center',
    fixed: 'right'
}

const _default = (props: _Props) => h(ElTableColumn,
    { minWidth: 100, ...tableColumnProps },
    {
        default: ({ row }: { row: HostAliasInfo }) => [modifyButton(props, row), deleteButton(props, row)]
    }
)

export default _default