/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h } from "vue"
import Article from "./common/article"
import { img, p, h2, alert } from "./common/util"
import { getUrl } from "@api/chrome/runtime"
import { PRIVACY_ROUTE } from "@guide/router/constants"

const _default = defineComponent(() => {
    return () => h(Article, {
        title: msg => msg.start.title,
        next: { title: msg => msg.privacy.title, route: PRIVACY_ROUTE },
    }, () => [
        p(msg => msg.start.p1),
        h2(msg => msg.start.s1),
        p(msg => msg.start.s1p1),
        img('pin.png', { height: 300 }),
        h2(msg => msg.start.s2),
        p(msg => msg.start.s2p1, {
            demo: h('img', { src: getUrl('static/images/guide/beating.gif') })
        }),
        h2(msg => msg.start.s3),
        p(msg => msg.start.s3p1),
        alert(msg => msg.start.alert, 'success'),
    ])
})

export default _default