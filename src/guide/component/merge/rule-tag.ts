/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@guide/locale"
import { computeMergeTxt, computeMergeType } from "@util/merge"
import { ElTag } from "element-plus"
import { h } from "vue"

export const renderRuleTag = (origin: string, merged: string | number) => {
    const mergedVal = merged ?? ''
    return h(ElTag, {
        type: computeMergeType(mergedVal),
        size: 'small',
    }, () => computeMergeTxt(origin, mergedVal, (finder, param) => t(msg => finder(msg.mergeCommon), param)))
}
