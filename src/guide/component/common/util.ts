/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { I18nKey } from "@guide/locale"
import type { VNode } from "vue"

import { getUrl } from "@api/chrome/runtime"
import { createTabAfterCurrent } from "@api/chrome/tab"
import { Link } from "@element-plus/icons-vue"
import { t, tN } from "@guide/locale"
import { getAppPageUrl } from "@util/constant/url"
import { ElAlert, ElButton } from "element-plus"
import { h } from "vue"

/**
 * paragraph
 */
export function p(i18nKey: I18nKey, param?: any): VNode {
    return h('p', tN(i18nKey, param))
}

/**
 * Subtitle
 */
export function h2(i18nKey: I18nKey, param?: any): VNode {
    return h('h2', tN(i18nKey, param))
}

/**
 * Image
 */
export function img(fileName: string, param?: { width?: number, height?: number }): VNode {
    return h('div', { class: 'img-container' },
        h('img', { ...(param || {}), src: getUrl(`static/images/guide/${fileName}`) })
    )
}

/**
 * Alert
 */
export function alert(i18nKey: I18nKey, type: 'success' | 'warning' | 'info' = 'info', param?: any): VNode {
    return h(ElAlert, {
        type,
        closable: false,
        showIcon: true,
    }, () => t(i18nKey, param))
}

/**
 * ul
 */
export function ul(...liKeys: ([I18nKey, any] | I18nKey)[]): VNode {
    return h('ul', { class: 'list-container' },
        liKeys.map(liKey => {
            let i18nKey: I18nKey = undefined, param = undefined
            if (typeof liKey === 'function') {
                i18nKey = liKey
            } else {
                i18nKey = liKey[0]
                param = liKey[1]
            }
            return h('li', tN(i18nKey, param))
        })
    )
}

export const appLink = (route?: string, query?: any) => link(getAppPageUrl(false, route, query))

export const link = (url: string) => h(ElButton, {
    link: true,
    icon: Link,
    type: 'primary',
    onClick: () => createTabAfterCurrent(url)
})