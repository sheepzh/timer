/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h } from "vue"
import Article from "./common/article"
import { BACKUP_ROUTE, VIRTUAL_ROUTE } from "@guide/router/constants"
import { p, h2, ul, appLink } from "./common/util"
import { t } from "@guide/locale"

const _default = defineComponent(() => {
    return () => h(Article, {
        previous: {
            route: VIRTUAL_ROUTE,
            title: msg => msg.virtual.title
        },
        next: {
            route: BACKUP_ROUTE,
            title: msg => msg.backup.title,
        },
        title: msg => msg.limit.title,
    }, () => [
        p(msg => msg.limit.p1),
        h2(msg => msg.limit.step.title),
        ul(
            [msg => msg.limit.step.enter, { link: appLink(), menuItem: t(msg => msg.appMenu.limit) }],
            msg => msg.limit.step.click,
            msg => msg.limit.step.form,
            msg => msg.limit.step.check,
        ),
    ])
})

export default _default