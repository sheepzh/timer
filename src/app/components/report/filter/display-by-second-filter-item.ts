
import { Ref } from "vue"
import { QueryData } from "../contants"
import switchFilterItem from "./switch-filter-item"

type _Props = {
    displayBySecondRef: Ref<boolean>
    queryData: QueryData
}

export type DisplayBySecondFilterItemProps = _Props

export default (props: DisplayBySecondFilterItemProps) => switchFilterItem({
    queryData: props.queryData,
    filterValRef: props.displayBySecondRef,
    itemTitle: 'displayBySecond'
})