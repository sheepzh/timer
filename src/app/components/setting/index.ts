import { ElTabPane, ElTabs, ElTag } from "element-plus"
import { defineComponent, h } from "vue"
import { t } from "../../../common/vue-i18n"
import { HOME_PAGE, GITHUB_ISSUE_ADD } from '../../../util/constant/url'
import Whitelist from './whitelist'
import DomainMerge from './domain-merge'
import './style'
import { version } from '../../../../package.json'

export default defineComponent(() => {
    const headItems = () => {
        const result = []
        const commonProps = { size: 'small', type: 'info' }
        result.push(h(ElTag, { ...commonProps, class: 'info-item' }, () => t('app.currentVersion', { version })))
        if (HOME_PAGE && HOME_PAGE !== '') {
            result.push(
                h(ElTag,
                    {
                        ...commonProps,
                        class: 'info-item point-item',
                        onClick: () => window.open(HOME_PAGE, "_blank")
                    },
                    () => t('setting.scoreRequest'))
            )
        }
        result.push(
            h(ElTag,
                {
                    ...commonProps,
                    class: 'info-item point-item',
                    onClick: () => window.open(GITHUB_ISSUE_ADD, "_blank")
                },
                () => t('setting.issueRequest')
            )
        )
        return result
    }

    const infoHead = () => h('div', { class: 'info-head' }, [headItems()])

    const settingTabs = () => h(ElTabs,
        { type: 'border-card' },
        () => [
            h(ElTabPane, { label: t('setting.whitelist.label') }, () => h(Whitelist)),
            h(ElTabPane, { label: t('setting.merge.label') }, () => h(DomainMerge))
        ]
    )
    return () => h('div', { class: 'content-container' }, [infoHead(), settingTabs()])
})