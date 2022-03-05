/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElButton, ElTableColumn } from "element-plus"
import { t } from "@app/locale"
import { h } from "vue"
import { HostAliasInfo } from "@entity/dto/host-alias-info"
import { Delete, Edit } from "@element-plus/icons"
import { QueryData } from "@app/components/common/constants"
import PopupConfirmButton from "@app/components/common/popup-confirm-button"

type _Props = {
    handleDelete: (row: HostAliasInfo) => Promise<void>
    handleModify: (row: HostAliasInfo) => Promise<void>
    queryData: QueryData
}

export type OperationButtonColumnProps = _Props

const deleteButtonText = t(msg => msg.siteManage.button.delete)
const deleteButton = (props: _Props, row: HostAliasInfo) => h(PopupConfirmButton, {
    buttonIcon: Delete,
    buttonType: "danger",
    buttonText: deleteButtonText,
    confirmText: t(msg => msg.siteManage.deleteConfirmMsg, { host: row.host }),
    onConfirm: async () => {
        await props.handleDelete(row)
        await props.queryData()
    }
})

const modifyButtonText = t(msg => msg.siteManage.button.modify)
const modifyButton = (props: _Props, row: HostAliasInfo) => h(ElButton, {
    size: 'mini',
    type: "primary",
    icon: Edit,
    onClick: () => props.handleModify(row)
}, () => modifyButtonText)

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