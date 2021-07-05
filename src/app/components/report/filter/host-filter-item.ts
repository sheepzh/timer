import { Ref } from "vue"
import { QueryData } from "../../common/constants"
import { inputFilterItem } from "../../common/filter"

export type HostFilterItemProps = {
    hostRef: Ref<string>
    queryData: QueryData
}
const host = ({ hostRef, queryData }: HostFilterItemProps) =>
    inputFilterItem(hostRef, msg => msg.report.hostPlaceholder, queryData)

export default host