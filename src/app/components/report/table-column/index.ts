import dateCol from "./date"
import hostCol, { HostColumnProps } from "./host"
import itemColumns, { ItemColumnProps } from "./item-columns"
import operationButtons, { OperationButtonColumnProps } from "./operation"

export type ColumnProps = HostColumnProps & ItemColumnProps & OperationButtonColumnProps

const columns = (props: ColumnProps) => {
    const result = []
    props.mergeDateRef.value || result.push(dateCol())
    result.push(hostCol(props))
    result.push(...itemColumns(props))
    !props.mergeDomainRef.value && result.push(operationButtons(props))
    return result
}

export default columns
