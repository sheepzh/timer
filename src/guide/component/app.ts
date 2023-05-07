/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h } from "vue"
import Article from "./common/article"
import { MERGE_ROUTE, PRIVACY_ROUTE } from "@guide/router/constants"
import { p, ul, alert } from "./common/util"
import { t } from "@guide/locale"

const _default = defineComponent(() => {
    return () => h(Article, {
        previous: {
            route: PRIVACY_ROUTE,
            title: msg => msg.privacy.title,
        },
        next: {
            route: MERGE_ROUTE,
            title: msg => msg.merge.title,
        },
        title: msg => msg.app.title,
    }, () => [
        p(msg => msg.app.p1),
        ul(
            [msg => msg.app.l1, { button: t(msg => msg.base.allFunction) }],
            [msg => msg.app.l2, { button: t(msg => msg.base.allFunction) }],
        ),
        alert(msg => msg.app.p2, 'success'),
    ])
})

export default _default