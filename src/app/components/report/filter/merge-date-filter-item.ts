import { Ref } from "vue"
import { QueryData } from "../contants"
import switchFilterItem from "./switch-filter-item"

export type MergeDateFilterItemProps = {
    mergeDateRef: Ref<boolean>
    queryData: QueryData
}

export default (props: MergeDateFilterItemProps) => switchFilterItem({
    queryData: props.queryData,
    filterValRef: props.mergeDateRef,
    itemTitle: 'mergeDate'
})