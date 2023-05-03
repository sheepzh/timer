/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ElTableRowScope } from "@src/element-ui/table"
import type { I18nKey } from "@guide/locale"
import type { VNode } from "vue"

import { t, tN } from "@guide/locale"
import { ElTable, ElTableColumn } from "element-plus"
import { h } from 'vue'
import { renderRuleTag } from "./rule-tag"
import CustomizedHostMergeRuler from "@service/components/host-merge-ruler"
import { PSL_HOMEPAGE } from "@util/constant/url"
import { link } from "../common/util"

type _RuleExample = {
    source: string
    target?: string | number
}

type _TargetExample = _RuleExample & {
    remark: I18nKey
}

type _SiteExample = {
    original: string
    ruleIdx?: number | number[]
    remark?: string | (VNode | string)[]
}

function computeTarget(val: undefined | string | number): string | number {
    return typeof val === 'number' ? val + 1 : (val || '')
}

const renderTag = (rule: _RuleExample) => renderRuleTag(rule?.source, rule?.target)

const TARGET_EXAMPLES: _TargetExample[] = [{
    source: 'www.google.com.*',
    target: 'google.com',
    remark: msg => msg.merge.target.remark.spec,
}, {
    source: 'www.google.com.hk',
    remark: msg => msg.merge.target.remark.blank
}, {
    source: '**.*.google.com',
    target: 2,
    remark: msg => msg.merge.target.remark.integer
}]

export const renderTargetTable = () => h(ElTable, {
    data: TARGET_EXAMPLES,
    border: true,
    fit: true,
}, () => [
    h(ElTableColumn, { label: t(msg => msg.merge.sourceCol), width: 180 }, {
        default: ({ row }: ElTableRowScope<_TargetExample>) => row.source
    }),
    h(ElTableColumn, { label: t(msg => msg.merge.targetCol), width: 150 }, {
        default: ({ row }: ElTableRowScope<_TargetExample>) => computeTarget(row.target)
    }),
    h(ElTableColumn, { label: t(msg => msg.merge.target.lookCol), width: 240 }, {
        default: ({ row }: ElTableRowScope<_TargetExample>) => renderTag(row)
    }),
    h(ElTableColumn, { label: t(msg => msg.merge.remarkCol), minWidth: 300 }, {
        default: ({ row: { source, target, remark } }: ElTableRowScope<_TargetExample>) => tN(remark, {
            source: h('i', source),
            target: h('i', computeTarget(target)),
        })
    }),
])

const MERGER = new CustomizedHostMergeRuler(TARGET_EXAMPLES.map(
    ({ source: origin, target: merged }) => ({ origin, merged })
))

const SITE_EXAMPLES: _SiteExample[] = [{
    original: 'www.google.com.au',
    ruleIdx: 0,
}, {
    original: 'www.google.com.pt',
    ruleIdx: 0,
}, {
    original: 'www.google.com.hk',
    ruleIdx: [0, 1],
    remark: t(msg => msg.merge.target.remark.specFirst),
}, {
    original: 'es.news.google.com',
    ruleIdx: [2],
}, {
    original: 'a.b.c.phontos.google.com',
    ruleIdx: [2],
}, {
    original: 'pass.hust.edu.cn',
    remark: tN(msg => msg.merge.target.remark.miss, {
        link: link(PSL_HOMEPAGE),
    }),
}]

function renderHitCell({ ruleIdx }: _SiteExample): string | VNode {
    const idxType = typeof ruleIdx
    if (idxType === 'undefined') {
        return ''
    } else if (idxType === 'number') {
        const rule = TARGET_EXAMPLES[ruleIdx as number]
        return rule ? renderTag(rule) : ''
    } else {
        return h('span',
            (ruleIdx as number[])
                .map(idx => TARGET_EXAMPLES[idx])
                .filter(a => !!a)
                .map(renderTag)
        )
    }
}

export const renderSiteExampleTable = () => h(ElTable, {
    data: SITE_EXAMPLES,
    border: true,
    fit: true,
}, () => [
    h(ElTableColumn, {
        width: 195,
        label: t(msg => msg.merge.target.originalCol),
        formatter: (row: _SiteExample) => row.original,
    }),
    h(ElTableColumn, {
        width: 160,
        label: t(msg => msg.merge.target.mergedCol),
        formatter: (row: _SiteExample) => MERGER.merge(row.original)
    }),
    h(ElTableColumn, {
        width: 235,
        label: t(msg => msg.merge.target.hitCol),
    }, {
        default: ({ row }: ElTableRowScope<_SiteExample>) => renderHitCell(row)
    }),
    h(ElTableColumn, {
        label: t(msg => msg.merge.remarkCol)
    }, {
        default: ({ row }: ElTableRowScope<_SiteExample>) => row.remark
    })
])