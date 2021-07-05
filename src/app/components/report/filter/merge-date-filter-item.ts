import { Ref } from "vue"
import { QueryData } from "../../common/constants"
import { switchFilterItem } from "../../common/filter"

export type MergeDateFilterItemProps = {
    mergeDateRef: Ref<boolean>
    queryData: QueryData
}

export default ({
    mergeDateRef,
    queryData
}: MergeDateFilterItemProps) => switchFilterItem(mergeDateRef, msg => msg.report.mergeDate, queryData)