/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { inputFilterItem, renderFilterContainer } from "../../common/filter"
import dateRange, { DateRangeFilterItemProps } from "./date-range-filter-item"
import displayBySecond, { DisplayBySecondFilterItemProps } from "./display-by-second-filter-item"
import downloadFile, { DownloadFileProps } from "./download-file"
import mergeDate, { MergeDateFilterItemProps } from "./merge-date-filter-item"
import mergeHost, { MergeHostFilterItemProps } from "./merge-host-filter-item"
import { Ref } from "vue"

export type FilterProps = DateRangeFilterItemProps
    & MergeDateFilterItemProps
    & MergeHostFilterItemProps
    & DisplayBySecondFilterItemProps
    & DownloadFileProps
    & {
        hostRef: Ref<string>
    }

const childNodes = (props: FilterProps) =>
    [
        inputFilterItem(props.hostRef, msg => msg.report.hostPlaceholder, props.queryData),
        dateRange(props),
        ...mergeDate(props),
        ...mergeHost(props),
        ...displayBySecond(props),
        downloadFile(props)
    ]

export default renderFilterContainer(childNodes)