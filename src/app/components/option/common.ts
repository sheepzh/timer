import { ElTag, ElButton, ElMessage } from "element-plus"
import { h, VNode } from "vue"
import { tN, t } from "../../locale"
import { OptionMessage } from "../../locale/components/option"

/**
 * Render the option item
 * 
 * @param input input of this option
 * @param label label
 * @param defaultValue default value
 */
export function renderOptionItem(input: VNode, label: (msg: OptionMessage) => string, defaultValue: string | number) {
    const labelArcher = h('a', { class: 'option-label' }, tN(msg => label(msg.option), { input }))
    const defaultTag = h(ElTag, { size: 'mini', type: 'primary' }, () => defaultValue)
    const defaultArcher = h('a', { class: 'option-default' }, tN(msg => msg.option.defaultValue, { default: defaultTag }))
    return h('div', { class: 'option-line' }, [labelArcher, defaultArcher])
}


const resetButtonProps = {
    type: 'text',
    class: 'reset-button',
    icon: 'el-icon-refresh'
}
const resetButtonMsg = () => t(msg => msg.option.resetButton)
const renderResetButton = (handleClick: () => PromiseLike<any>) => h(ElButton, {
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