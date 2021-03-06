import { ElButton, ElMessage, ElMessageBox, ElPopconfirm, ElTableColumn } from "element-plus"
import { h } from "vue"
import TimeLimitItem from "../../../../../entity/dto/time-limit-item"
import limitService from "../../../../../service/limit-service"
import { t } from "../../../../locale"
import { QueryData } from "../../../common/constants"

const columnProps = {
    prop: 'operations',
    label: t(msg => msg.limit.item.operation),
    minWidth: 80,
    align: 'center',
}

async function deleteItem(cond: string, queryData: QueryData) {
    await limitService.remove(cond)
    ElMessage.success(t(msg => msg.limit.message.deleted))
    queryData()
}

function handleDelete(cond: string, queryData: QueryData) {
    const message = t(msg => msg.limit.message.deleteConfirm, { cond })
    ElMessageBox.confirm(message, { type: 'warning' })
        .then(() => deleteItem(cond, queryData))
}

const renderButtons = (row: TimeLimitItem, queryData: QueryData) => {
    const deleteProps = {
        type: 'danger',
        size: 'mini',
        icon: 'el-icon-delete',
        onClick: () => handleDelete(row.cond, queryData)
    }
    const deleteButton = h(ElButton, deleteProps, () => t(msg => msg.limit.button.delete))
    return [deleteButton]
}

const defaultSlot = (row: TimeLimitItem, queryData: QueryData) => renderButtons(row, queryData)

const _default = (queryData: QueryData) => h(ElTableColumn, columnProps, { default: ({ row }: { row: TimeLimitItem }) => defaultSlot(row, queryData) })

export default _default