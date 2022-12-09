/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { InfoFilled } from "@element-plus/icons-vue"
import { ElTag, ElTooltip, ElIcon } from "element-plus"
import { h, isVNode, VNode } from "vue"
import { tN, t, I18nKey } from "@app/locale"
import { OptionMessage } from "@i18n/message/app/option"

/**
 * Render the option item
 * 
 * @param input input of this option, or param map
 * @param label label
 * @param defaultValue default value
 */
export function renderOptionItem(input: VNode | { [key: string]: VNode }, label: (msg: OptionMessage) => string, defaultValue?: string | number) {
    const param = isVNode(input) ? { input } : input
    const labelArcher = h('a', { class: 'option-label' }, tN(msg => label(msg.option), param))
    const content = [labelArcher]
    if (!!defaultValue) {
        const defaultTag = h(ElTag, { size: 'small' }, () => defaultValue)
        const defaultArcher = h('a', { class: 'option-default' }, tN(msg => msg.option.defaultValue, { default: defaultTag }))
        content.push(defaultArcher)
    }
    return h('div', { class: 'option-line' }, content)
}

/**
 * Render text wrapped with tag
 * 
 * @param text text
 */
export function tagText(text: I18nKey): VNode {
    return h('a', { class: 'option-tag' }, t(text))
}

/**
 * Render the tooltip with message
 *
 * @param content content 
 * @since 0.5.0
 */
export function tooltip(content: I18nKey): VNode {
    return h(ElTooltip, { content: t(content) }, {
        default: () => h(ElIcon, { size: 15 }, () => h(InfoFilled))
    })
}