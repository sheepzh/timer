
import { Ref } from "vue"
import { QueryData } from "../contants"
import switchFilterItem from "./switch-filter-item"

export type MergeDomainFilterItemProps = {
    mergeDomainRef: Ref<boolean>
    queryData: QueryData
}

export default (props: MergeDomainFilterItemProps) => switchFilterItem({
    queryData: props.queryData,
    filterValRef: props.mergeDomainRef,
    itemTitle: 'mergeDomain'
})