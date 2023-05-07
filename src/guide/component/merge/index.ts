/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h } from "vue"
import Article from "../common/article"
import { APP_PAGE_ROUTE, VIRTUAL_ROUTE } from "@guide/router/constants"
import { p, h2, appLink, } from "../common/util"
import { MERGE_ROUTE } from "@app/router/constants"
import { renderTargetTable, renderSiteExampleTable } from "./target-table"
import { renderSourceTable } from "./source-table"
import { renderRuleTag } from "./rule-tag"
import "./merge.sass"

const renderDemo = () => renderRuleTag('gist.github.com', 'github.com')

const _default = defineComponent(() => {
    return () => h(Article, {
        previous: {
            route: APP_PAGE_ROUTE,
            title: msg => msg.app.title
        },
        next: {
            route: VIRTUAL_ROUTE,
            title: msg => msg.virtual.title,
        },
        title: msg => msg.merge.title,
    }, () => [
        p(msg => msg.merge.p1, {
            demo1: h('i', 'www.github.com'),
            demo2: h('i', 'gist.github.com'),
        }),
        p(msg => msg.merge.p2, { link: appLink(MERGE_ROUTE) }),
        h2(msg => msg.merge.lookTitle),
        p(msg => msg.merge.p3, { demo: renderDemo() }),
        h2(msg => msg.merge.source.title),
        p(msg => msg.merge.source.p1),
        renderSourceTable(),
        h2(msg => msg.merge.target.title),
        p(msg => msg.merge.target.p1),
        renderTargetTable(),
        p(msg => msg.merge.target.p2),
        renderSiteExampleTable(),
    ])
})

export default _default