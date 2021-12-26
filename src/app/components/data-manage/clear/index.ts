/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElAlert, ElCard } from "element-plus"
import { h } from "vue"
import { t } from "@app/locale"
import { alertProps, bodyStyle } from "../common"
import Filter from "./filter"

type _Props = {
    queryData: () => Promise<void> | void
}

const clearAlert = () => h(ElAlert,
    {
        ...alertProps,
        title: t(msg => msg.dataManage.operationAlert)
    })
const clearFilter = (queryData: () => Promise<void> | void) => h(Filter, { onDateChanged: queryData })
const clearPanel = (props: _Props) => h(ElCard,
    { bodyStyle },
    () => [clearAlert(), clearFilter(props.queryData)]
)

export default clearPanel