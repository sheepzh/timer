/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { I18nKey } from "@guide/locale"

import { t, tN } from "@guide/locale"
import { ElTableRowScope } from "@src/element-ui/table"
import { ElTable, ElTableColumn, ElTag } from "element-plus"
import { h } from "vue"

type _SourceExample = {
    source: string
    examples: string[] | I18nKey
}

const renderSiteExample = (site: string) => h(ElTag, { type: 'info', size: 'small' }, () => site)

const SOURCE_EXAMPLES: _SourceExample[] = [{
    source: 'www.google.com',
    examples: msg => msg.merge.source.only,
}, {
    source: 'www.google.com.*',
    examples: ['www.google.com.hk', 'www.google.com.au'],
}, {
    source: '**.mit.edu',
    examples: ['www.mit.edu', 'libraries.mit.edu', 'web.mit.edu', 'foo.bar.mit.edu'],
}]

const renderSourceExample = (row: _SourceExample) => {
    const { source, examples } = row
    if (typeof examples === 'function') {
        return h('span', tN(examples, { source: renderSiteExample(source) }))
    }
    const exampleTags = examples.map(renderSiteExample)
    return h('div', { class: 'source-example-cell' }, exampleTags)
}

export const renderSourceTable = () => h(ElTable, {
    data: SOURCE_EXAMPLES,
    border: true,
    fit: true,
}, () => [
    h(ElTableColumn, {
        label: t(msg => msg.merge.sourceCol),
        width: 240,
    }, {
        default: ({ row }: ElTableRowScope<_SourceExample>) => row.source
    }),
    h(ElTableColumn, { label: t(msg => msg.merge.source.exampleCol) }, {
        default: ({ row }: ElTableRowScope<_SourceExample>) => renderSourceExample(row)
    }),
])