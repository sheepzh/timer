/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h } from "vue"
import Article from "./common/article"
import { LIMIT_ROUTE, MERGE_ROUTE } from "@guide/router/constants"
import { p, h2, ul, appLink } from "./common/util"
import { ElTag } from "element-plus"
import { t } from "@guide/locale"

const demoTag = (demoSite: string) => h(ElTag, { size: 'small', type: 'info' }, () => demoSite)

const _default = defineComponent(() => {
    return () => h(Article, {
        previous: {
            route: MERGE_ROUTE,
            title: msg => msg.merge.title
        },
        next: {
            route: LIMIT_ROUTE,
            title: msg => msg.limit.title
        },
        title: msg => msg.virtual.title,
    }, () => [
        p(msg => msg.virtual.p1),
        h2(msg => msg.virtual.step.title),
        ul(
            [msg => msg.virtual.step.enter, { link: appLink(), menuItem: t(msg => msg.appMenu.siteManage) }],
            msg => msg.virtual.step.click,
            [msg => msg.virtual.step.form, {
                demo1: demoTag('github.com/sheepzh'),
                demo2: demoTag('github.com/sheepzh/timer/**'),
            }],
            msg => msg.virtual.step.browse,
        ),
    ])
})

export default _default