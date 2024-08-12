import { t } from "@app/locale"
import {
    HOMEPAGE, CHROME_HOMEPAGE, EDGE_HOMEPAGE, FIREFOX_HOMEPAGE,
    FEEDBACK_QUESTIONNAIRE, GITHUB_ISSUE_ADD, REVIEW_PAGE,
    LICENSE_PAGE, PRIVACY_PAGE, SOURCE_CODE_PAGE, CHANGE_LOG_PAGE,
    getHomepageWithLocale,
} from "@util/constant/url"
import { ElCard, ElDescriptions, ElDescriptionsItem, ElDivider, ElSpace, ElText } from "element-plus"
import { defineComponent, StyleValue } from "vue"
import InstallationLink from "./InstallationLink"
import packageInfo, { AUTHOR_EMAIL } from "@src/package"
import "./description.sass"
import metaService from "@service/meta-service"
import DescLink from "./DescLink"
import { locale } from "@i18n"

const INSTALLATION_STYLE: StyleValue = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "10px"
}

const _default = defineComponent(() => {
    const feedbackUrl = FEEDBACK_QUESTIONNAIRE[locale] || GITHUB_ISSUE_ADD

    return () => <ElCard class="description-container">
        <ElDescriptions size="large" column={2} border>
            <ElDescriptionsItem label={t(msg => msg.about.label.name)} labelAlign="right">
                {t(msg => msg.meta.marketName)}
            </ElDescriptionsItem>
            <ElDescriptionsItem label={t(msg => msg.about.label.version)} labelAlign="right">
                v{packageInfo.version}
            </ElDescriptionsItem>
            <ElDescriptionsItem label={t(msg => msg.about.label.website)} labelAlign="right">
                <DescLink href={getHomepageWithLocale()}>
                    {HOMEPAGE}
                </DescLink>
            </ElDescriptionsItem>
            <ElDescriptionsItem label={t(msg => msg.about.label.privacy)} labelAlign="right">
                <DescLink href={PRIVACY_PAGE}>
                    {PRIVACY_PAGE}
                </DescLink>
            </ElDescriptionsItem>
            <ElDescriptionsItem label={t(msg => msg.about.label.sourceCode)} labelAlign="right">
                <DescLink href={SOURCE_CODE_PAGE} icon="github">
                    {SOURCE_CODE_PAGE}
                </DescLink>
            </ElDescriptionsItem>
            <ElDescriptionsItem label={t(msg => msg.about.label.license)} labelAlign="right">
                <DescLink href={LICENSE_PAGE}>
                    MIT License
                </DescLink>
            </ElDescriptionsItem>
            <ElDescriptionsItem label={t(msg => msg.base.changeLog)} labelAlign="right">
                <DescLink href={CHANGE_LOG_PAGE} icon="github">
                    {CHANGE_LOG_PAGE}
                </DescLink>
            </ElDescriptionsItem>
            <ElDescriptionsItem label={t(msg => msg.about.label.support)} labelAlign="right">
                {AUTHOR_EMAIL}
            </ElDescriptionsItem>
            <ElDescriptionsItem label={t(msg => msg.about.label.installation)} labelAlign="right">
                <div style={INSTALLATION_STYLE}>
                    <InstallationLink href={CHROME_HOMEPAGE} name="Chrome" source="chrome" />
                    <ElSpace />
                    <InstallationLink href={EDGE_HOMEPAGE} name="Edge" source="edge" />
                    <ElSpace />
                    <InstallationLink href={FIREFOX_HOMEPAGE} name="Firefox" source="firefox" />
                </div>
            </ElDescriptionsItem>
            <ElDescriptionsItem label={t(msg => msg.about.label.thanks)} labelAlign="right">
                <div>
                    <DescLink href="https://vuejs.org/" icon="vue">VueJS</DescLink>
                </div>
                <div>
                    <DescLink href="https://echarts.apache.org/" icon="echarts">Echarts</DescLink>
                </div>
                <div>
                    <DescLink href="https://element-plus.org/" icon="element-plus">Element Plus</DescLink>
                </div>
            </ElDescriptionsItem>
        </ElDescriptions>
        <ElDivider />
        <div class="text-container">
            <div>
                <ElText size="large">
                    🌟&ensp;
                    {t(msg => msg.about.text.greet)}&ensp;
                    <a href={REVIEW_PAGE || CHROME_HOMEPAGE} target="_blank" onClick={() => metaService.saveFlag("rateOpen")}>
                        {t(msg => msg.about.text.rate)}
                    </a>
                </ElText>
            </div>
            <div>
                <ElText size="large">
                    🙋&ensp;
                    <a href={feedbackUrl}>{t(msg => msg.about.text.feedback)}</a>
                </ElText>
            </div>
        </div>
    </ElCard >
})

export default _default