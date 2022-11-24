import type { I18nKey } from "@guide/locale"
import type { VNode } from "vue"

import { t, tN } from "@guide/locale"
import { h } from "vue"

export function h1(i18nKey: I18nKey, archorClz: string): VNode {
    return h('h1', { class: `guide-h1 archor-${archorClz}` }, t(i18nKey))
}

export function h2(i18nKey: I18nKey, archorClz: string): VNode {
    return h('h2', { class: `guide-h2 archor-${archorClz}` }, t(i18nKey))
}

export function paragraph(i18nKey: I18nKey, param?: any): VNode {
    return h('div', { class: 'guide-paragragh' }, tN(i18nKey, param))
}

export function link(href: string, text: string): VNode {
    return h('a', { class: 'guide-link', href, target: "_blank" }, text)
}

export function linkInner(extensionUrl: string, text: string): VNode {
    return h('a', {
        class: 'guide-link',
        onClick: () => chrome.tabs.create({ url: extensionUrl }),
    }, text)
}

export function list(...items: (I18nKey | [I18nKey, any])[]): VNode {
    const children = items.map(item => {
        let param = undefined
        let i18nKey: I18nKey = undefined
        if (Array.isArray(item)) {
            [i18nKey, param] = item
        } else {
            i18nKey = item
        }
        return h('li', { class: 'guide-list-item' }, tN(i18nKey, param))
    })
    return h('ul', { class: 'guide-list' }, children)
}

export function section(...vnodes: VNode[]): VNode {
    return h('section', { class: 'guide-area' }, vnodes)
}