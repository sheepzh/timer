import { version } from '../../../package.json'
import { ElOption, ElSelect, ElTooltip, ElSwitch, ElLink } from "element-plus"
import { locale, t } from "../locale"
import { ComputedRef, h, Ref } from "vue"
import { ALL_SITE_ITEMS, SiteItem } from "../../entity/dto/site-info"
import { IS_FIREFOX } from "../../util/constant/environment"
import { ZH_FEEDBACK_PAGE, UPDATE_PAGE } from "../../util/constant/url"
import { Locale } from "../../util/i18n"

type _Props = {
    totalInfo: ComputedRef<string>
    latestVersionRef: Ref<string>
    typeRef: Ref<SiteItem>
    mergeDomainRef: Ref<boolean>
}

export type FooterProps = _Props

// 1. total info and version
const versionProps = {
    class: "option-left",
    style: "color: #606266;font-size:12px;"
}
const versionAndTotalInfo = (props: _Props) => h('span', versionProps, `v${version} ${props.totalInfo.value}`)

// 2. type select
const options = () => ALL_SITE_ITEMS.map(item => h(ElOption, { value: item, label: t(msg => msg.item[item]) }))
const typeSelect = (props: _Props) => h(ElSelect,
    {
        modelValue: props.typeRef.value,
        class: 'option-right',
        style: 'width:140px;',
        size: 'mini',
        onChange: (val: SiteItem) => props.typeRef.value = val
    },
    options
)

// 3. merge domain switch
const mergeDomainTooltipProps = {
    content: t(msg => msg.mergeDomainLabel),
    placement: 'top'
}
const mergeDomainSwitchInput = ({ mergeDomainRef }: _Props) => h(ElSwitch,
    {
        modelValue: mergeDomainRef.value,
        style: 'margin-left:10px;',
        class: 'option-right',
        onChange: (val: boolean) => mergeDomainRef.value = val
    }
)
const mergeDomainSwitch = (props: _Props) => h(ElTooltip, mergeDomainTooltipProps, () => mergeDomainSwitchInput(props))

// 4. app link
const linkProps = {
    icon: 'el-icon-view',
    class: 'option-right',
    // FireFox use 'static' as prefix
    onClick: () => chrome.tabs.create({ url: IS_FIREFOX ? 'app.html' : 'static/app.html' })
}
const link = () => h(ElLink, linkProps, () => t(msg => msg.viewMore))
// 5. feedback
const feedbackProps = {

    icon: 'el-icon-edit',
    class: 'option-right',
    onClick: () => chrome.tabs.create({ url: ZH_FEEDBACK_PAGE })
}
const feedback = () => h(ElLink, feedbackProps, () => t(msg => msg.feedback))

// 6. version update alert
const versionUpdateLink = () => h(ElLink,
    {
        type: 'success',
        icon: 'el-icon-download',
        class: 'option-right',
        onClick: () => chrome.tabs.create({ url: UPDATE_PAGE })
    },
    () => t(msg => msg.updateVersion)
)
const versionUpdate = ({ latestVersionRef }: _Props) => h(ElTooltip,
    { placement: 'top', effect: 'light' },
    {
        default: () => versionUpdateLink(),
        content: () => t(msg => msg.updateVersionInfo, { version: `v${latestVersionRef.value}` })
    })

const footerItems = (props: _Props) => {
    const result = [
        versionAndTotalInfo(props),
        typeSelect(props),
        mergeDomainSwitch(props),
        link()
    ]
    locale === Locale.ZH_CN && result.push(feedback())
    const latestVersion = props.latestVersionRef.value
    latestVersion && latestVersion !== version && result.push(versionUpdate(props))
    return result
}

const footer = (props: _Props) => h('div', { class: 'option-container' }, footerItems(props))

export default footer