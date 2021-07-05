import { ElTabPane, ElTabs, ElTag } from "element-plus"
import { defineComponent, h } from "vue"
import { t } from "../../locale"
import { HOME_PAGE, GITHUB_ISSUE_ADD } from '../../../util/constant/url'
import Whitelist from './whitelist'
import DomainMerge from './domain-merge'
import { version } from '../../../../package.json'
import './style'
import { renderContentContainer } from "../common/content-container"
const headItems = () => {
    const result = []
    const commonProps = { size: 'small', type: 'info' }
    result.push(h(ElTag, { ...commonProps, class: 'info-item' }, () => t(msg => msg.app.currentVersion, { version })))
    if (HOME_PAGE && HOME_PAGE !== '') {
        result.push(
            h(ElTag,
                {
                    ...commonProps,
                    class: 'info-item point-item',
                    onClick: () => window.open(HOME_PAGE, "_blank")
                },
                () => t(msg => msg.setting.scoreRequest))
        )
    }
    result.push(
        h(ElTag,
            {
                ...commonProps,
                class: 'info-item point-item',
                onClick: () => window.open(GITHUB_ISSUE_ADD, "_blank")
            },
            () => t(msg => msg.setting.issueRequest)
        )
    )
    return result
}

const infoHead = () => h('div', { class: 'info-head' }, [headItems()])

const settingTabs = () => h(ElTabs,
    { type: 'border-card' },
    () => [
        h(ElTabPane, { label: t(msg => msg.setting.whitelist.label) }, () => h(Whitelist)),
        h(ElTabPane, { label: t(msg => msg.setting.merge.label) }, () => h(DomainMerge))
    ]
)
export default defineComponent(() => renderContentContainer(() => [infoHead(), settingTabs()]))