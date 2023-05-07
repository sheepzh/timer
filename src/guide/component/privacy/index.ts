/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ElTableRowScope } from "@src/element-ui/table"

import { defineComponent, h } from "vue"
import Article from "../common/article"
import { p, h2, alert } from "../common/util"
import { ElIcon, ElTable, ElTableColumn } from "element-plus"
import { PrivacyMessage, Scope } from "@i18n/message/guide/privacy"
import { t } from "@guide/locale"
import { CircleCheck, Warning } from "@element-plus/icons-vue"
import './privacy.sass'
import { START_ROUTE, APP_PAGE_ROUTE } from "@guide/router/constants"

type ScopeRow = keyof PrivacyMessage['scope']['rows']

const ALL_ROWS: ScopeRow[] = ['website', 'tab', 'clipboard']

const renderTable = () => h(ElTable, {
    data: ALL_ROWS,
    border: true,
    fit: true,
    cellClassName: 'scope-table-cell',
}, () => [
    h(ElTableColumn, {
        label: t(msg => msg.privacy.scope.cols.name),
        minWidth: 200,
    }, {
        default: ({ row }: ElTableRowScope<ScopeRow>) => t(msg => msg.privacy.scope.rows[row].name)
    }),
    h(ElTableColumn, {
        label: t(msg => msg.privacy.scope.cols.usage),
        minWidth: 500,
    }, {
        default: ({ row }: ElTableRowScope<ScopeRow>) => t(msg => msg.privacy.scope.rows[row].usage)
    }),
    h(ElTableColumn, {
        label: t(msg => msg.privacy.scope.cols.required),
        width: 250
    }, {
        default: ({ row }: ElTableRowScope<ScopeRow>) => {
            const reason = t(msg => (msg.privacy.scope.rows[row] as Scope).optionalReason)
            return h('span', { class: reason ? 'optional' : 'required' }, [
                h(ElIcon, () => h(reason ? Warning : CircleCheck)),
                reason
            ])
        }
    }),
])

const _default = defineComponent(() => {
    return () => h(Article, {
        title: msg => msg.privacy.title,
        previous: { route: START_ROUTE, title: msg => msg.start.title },
        next: { route: APP_PAGE_ROUTE, title: msg => msg.app.title },
    }, () => [
        alert(msg => msg.privacy.alert, 'warning'),
        h2(msg => msg.privacy.scope.title),
        renderTable(),
        h2(msg => msg.privacy.storage.title),
        p(msg => msg.privacy.storage.p1),
        p(msg => msg.privacy.storage.p2),
        alert(msg => msg.privacy.storage.p3, 'info'),
    ])
})

export default _default