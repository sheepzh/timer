
/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { EDGE_HOMEPAGE, CHROME_HOMEPAGE, FIREFOX_HOMEPAGE, SOURCE_CODE_PAGE } from "@util/constant/url"
import { defineComponent } from "vue"

import { h1, paragraph, link, section } from "./common"

const _default = defineComponent({
    name: 'GuideProfile',
    setup() {
        return () => section(
            h1(msg => msg.layout.menu.profile, 'profile'),
            paragraph(msg => msg.profile.p1, {
                edge: link(EDGE_HOMEPAGE, 'Edge'),
                chrome: link(CHROME_HOMEPAGE, 'Chrome'),
                firefox: link(FIREFOX_HOMEPAGE, 'Firefox'),
                github: link(SOURCE_CODE_PAGE, 'Github'),
            }),
            paragraph(msg => msg.profile.p2),
        )
    }
})

export default _default