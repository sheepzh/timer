import { renderFilterContainer } from "../../common/filter"
import dateRange, { DateRangeFilterItemProps } from "./date-range-filter-item"
import displayBySecond, { DisplayBySecondFilterItemProps } from "./display-by-second-filter-item"
import downloadFile, { DownloadFileProps } from "./download-file"
import host, { HostFilterItemProps } from "./host-filter-item"
import mergeDate, { MergeDateFilterItemProps } from './merge-date-filter-item'
import mergeDomain, { MergeDomainFilterItemProps } from "./merge-domain-filter-item"

export type FilterProps = HostFilterItemProps
    & DateRangeFilterItemProps
    & MergeDateFilterItemProps
    & MergeDomainFilterItemProps
    & DisplayBySecondFilterItemProps
    & DownloadFileProps

const childNodes = (props: FilterProps) =>
    [
        host(props),
        dateRange(props),
        ...mergeDate(props),
        ...mergeDomain(props),
        ...displayBySecond(props),
        downloadFile(props)
    ]

export default renderFilterContainer(childNodes)