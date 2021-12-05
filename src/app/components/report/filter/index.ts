/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { renderFilterContainer } from "../../common/filter"
import dateRange, { DateRangeFilterItemProps } from "./date-range-filter-item"
import displayBySecond, { DisplayBySecondFilterItemProps } from "./display-by-second-filter-item"
import downloadFile, { DownloadFileProps } from "./download-file"
import host, { HostFilterItemProps } from "./host-filter-item"
import mergeDate, { MergeDateFilterItemProps } from "./merge-date-filter-item"
import mergeHost, { MergeHostFilterItemProps } from "./merge-host-filter-item"

export type FilterProps = HostFilterItemProps
    & DateRangeFilterItemProps
    & MergeDateFilterItemProps
    & MergeHostFilterItemProps
    & DisplayBySecondFilterItemProps
    & DownloadFileProps

const childNodes = (props: FilterProps) =>
    [
        host(props),
        dateRange(props),
        ...mergeDate(props),
        ...mergeHost(props),
        ...displayBySecond(props),
        downloadFile(props)
    ]

export default renderFilterContainer(childNodes)