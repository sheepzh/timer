/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h } from "vue"
import Article from "./common/article"
import { LIMIT_ROUTE } from "@guide/router/constants"
import { p, ul, h2, alert, appLink, link } from "./common/util"
import { OPTION_ROUTE, REPORT_ROUTE } from "@app/router/constants"
import { t } from "@guide/locale"
import { ElButton } from "element-plus"
import { UploadFilled } from "@element-plus/icons-vue"

const _default = defineComponent(() => {
    return () => h(Article, {
        previous: {
            route: LIMIT_ROUTE,
            title: msg => msg.limit.title
        },
        title: msg => msg.backup.title,
    }, () => [
        p(msg => msg.backup.p1, { link: link('https://gist.github.com') }),
        h2(msg => msg.backup.upload.title),
        ul(
            [msg => msg.backup.upload.prepareToken, { link: link('https://github.com/settings/tokens') }],
            [msg => msg.backup.upload.enter, { link: appLink(OPTION_ROUTE, { i: 'backup' }) }],
            msg => msg.backup.upload.form,
            msg => msg.backup.upload.backup,
        ),
        h2(msg => msg.backup.query.title),
        p(msg => msg.backup.query.p1),
        ul(
            [msg => msg.backup.query.enter, {
                link: appLink(REPORT_ROUTE),
                menuItem: t(msg => msg.appMenu.dataReport),
            }], [msg => msg.backup.query.enable, {
                icon: h(ElButton, {
                    type: 'text',
                    link: true,
                    icon: UploadFilled,
                    disabled: true
                })
            }],
            msg => msg.backup.query.wait,
        ),
        alert(msg => msg.backup.query.tip, 'warning'),
    ])
})

export default _default