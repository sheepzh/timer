import { ElTabPane, ElTabs, ElTag } from "element-plus"
import { defineComponent, h } from "vue"
import { locale, t } from "../../locale"
import { HOME_PAGE, GITHUB_ISSUE_ADD, ZH_FEEDBACK_PAGE } from '../../../util/constant/url'
import Whitelist from './whitelist'
import DomainMerge from './domain-merge'
import { version } from '../../../../package.json'
import './style'
import { renderContentContainer } from "../common/content-container"
import { Locale } from "../../../util/i18n"

/**
 * Use ZH_FEEDBACK_PAGE, if the locale is Chinese
 * 
 * @since 0.3.2
 */
const realFeedbackLink: string = locale === Locale.ZH_CN ? ZH_FEEDBACK_PAGE : GITHUB_ISSUE_ADD

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
                () => t(msg => msg.additional.scoreRequest))
        )
    }
    result.push(
        h(ElTag,
            {
                ...commonProps,
                class: 'info-item point-item',
                onClick: () => window.open(realFeedbackLink, "_blank")
            },
            () => t(msg => msg.additional.issueRequest)
        )
    )
    return result
}

const infoHead = () => h('div', { class: 'info-head' }, [headItems()])

const settingTabs = () => h(ElTabs,
    { type: 'border-card' },
    () => [
        h(ElTabPane, { label: t(msg => msg.additional.whitelist.label) }, () => h(Whitelist)),
        h(ElTabPane, { label: t(msg => msg.additional.merge.label) }, () => h(DomainMerge))
    ]
)
export default defineComponent(() => renderContentContainer(() => [infoHead(), settingTabs()]))