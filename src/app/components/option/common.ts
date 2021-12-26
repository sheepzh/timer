/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { InfoFilled, Refresh } from "@element-plus/icons"
import { ElTag, ElButton, ElMessage, ElTooltip, ElIcon } from "element-plus"
import { h, isVNode, VNode } from "vue"
import { tN, t, I18nKey } from "@app/locale"
import { OptionMessage } from "@app/locale/components/option"

/**
 * Render the option item
 * 
 * @param input input of this option, or param map
 * @param label label
 * @param defaultValue default value
 */
export function renderOptionItem(input: VNode | { [key: string]: VNode }, label: (msg: OptionMessage) => string, defaultValue: string | number) {
    const param = isVNode(input) ? { input } : input
    const labelArcher = h('a', { class: 'option-label' }, tN(msg => label(msg.option), param))
    const defaultTag = h(ElTag, { size: 'mini' }, () => defaultValue)
    const defaultArcher = h('a', { class: 'option-default' }, tN(msg => msg.option.defaultValue, { default: defaultTag }))
    return h('div', { class: 'option-line' }, [labelArcher, defaultArcher])
}

const resetButtonProps = {
    type: 'text',
    class: 'reset-button',
    icon: Refresh
}
const resetButtonMsg = () => t(msg => msg.option.resetButton)
const renderResetButton = (handleClick: () => PromiseLike<any>) => h<{}>(ElButton, {
    ...resetButtonProps, async onClick() {
        await handleClick()
        ElMessage.success(t(msg => msg.option.resetSuccess))
    }
}, resetButtonMsg)

/**
 * Render the header 
 * 
 * @param title title text 
 * @param handleReset reset click handler
 * @returns VNode
 */
export function renderHeader(title: (msg: OptionMessage) => string, handleReset: () => PromiseLike<any>): VNode {
    const titleSpan = h('span', { class: 'card-title' }, t(msg => title(msg.option)))
    const resetButton = renderResetButton(handleReset)
    return h('div', { class: 'card-header' }, [titleSpan, resetButton])
}

/**
 * Render text wrapped with tag
 * 
 * @param text text
 */
export function tagText(text: I18nKey): VNode {
    return h('a', { style: { color: '#F56C6C' } }, t(text))
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