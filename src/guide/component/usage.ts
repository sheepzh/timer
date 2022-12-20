import { getAppPageUrl, PSL_HOMEPAGE } from "@util/constant/url"
import { defineComponent } from "vue"
import { h1, h2, paragraph, list, link, section, linkInner } from "./common"
import { t } from "../locale"

const quickstart = () => [
    h2(msg => msg.layout.menu.usage.quickstart, 'quickstart'),
    paragraph(msg => msg.usage.quickstart.p1),
    list(
        msg => msg.usage.quickstart.l1,
        msg => msg.usage.quickstart.l2,
        msg => msg.usage.quickstart.l3,
    ),
    paragraph(msg => msg.usage.quickstart.p2),
]

const backgroundPageUrl = getAppPageUrl(false)

const background = () => [
    h2(msg => msg.layout.menu.usage.background, 'background'),
    paragraph(msg => msg.usage.background.p1, {
        background: linkInner(backgroundPageUrl, t(msg => msg.usage.background.backgroundPage))
    }),
    list(
        [msg => msg.usage.background.l1, { allFunction: t(msg => msg.base.allFunction) }],
        [msg => msg.usage.background.l2, { allFunction: t(msg => msg.base.allFunction) }],
    ),
    paragraph(msg => msg.usage.background.p2),
]

const advanced = () => [
    h2(msg => msg.layout.menu.usage.advanced, 'advanced'),
    paragraph(msg => msg.usage.advanced.p1),
    list(
        msg => msg.usage.advanced.l1,
        msg => msg.usage.advanced.l2,
        msg => msg.usage.advanced.l3,
        msg => msg.usage.advanced.l4,
        [msg => msg.usage.advanced.l5, {
            psl: link(PSL_HOMEPAGE, 'Public Suffix List')
        }],
        msg => msg.usage.advanced.l6,
        msg => msg.usage.advanced.l7,
        msg => msg.usage.advanced.l8,
    ),
]

const _default = defineComponent({
    setup() {
        return () => section(
            h1(msg => msg.layout.menu.usage.title, 'usage'),
            ...quickstart(),
            ...background(),
            ...advanced(),
        )
    }
})

export default _default