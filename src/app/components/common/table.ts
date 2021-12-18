/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElLink } from "element-plus"
import { h } from "vue"

const HOST_ICON_STYLE: Partial<CSSStyleDeclaration> = {
    height: "23px",
    lineHeight: "23px",
    paddingLeft: "2px"
}

/**
 * Render the host with el-link
 * 
 * @param host      host
 * @param iconUrl   icon url
 * @returns VNode[]
 */
export const host2ElLink = (host: string, iconUrl: string) => {
    const link = h(ElLink,
        { href: `http://${host}`, target: '_blank' },
        () => host
    )
    const icon = h('span',
        { style: HOST_ICON_STYLE },
        h('img', { src: iconUrl, width: 12, height: 12 })
    )
    return [link, icon]
}