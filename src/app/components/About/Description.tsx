import { t } from "@app/locale"
import { CHROME_HOMEPAGE, EDGE_HOMEPAGE, FEEDBACK_QUESTIONNAIRE, FIREFOX_HOMEPAGE, getHomepageWithLocale, GITHUB_ISSUE_ADD, HOMEPAGE, SOURCE_CODE_PAGE, WEBSTORE_PAGE } from "@util/constant/url"
import { ElCard, ElDescriptions, ElDescriptionsItem, ElDivider, ElSpace, ElText } from "element-plus"
import { defineComponent, StyleValue } from "vue"
import InstallationLink from "./InstallationLink"
import packageInfo from "@src/package"
import { locale } from "@i18n"
import "./description.sass"
import metaService from "@service/meta-service"
import DescLink from "./DescLink"

const INSTALLATION_STYLE: StyleValue = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "10px"
}

const _default = defineComponent(() => {
    const webstoreUrl = WEBSTORE_PAGE || CHROME_HOMEPAGE
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
                <DescLink href="https://www.wfhg.cc/en/privacy.html">
                    https://www.wfhg.cc/en/privacy.html
                </DescLink>
            </ElDescriptionsItem>
            <ElDescriptionsItem label={t(msg => msg.about.label.sourceCode)} labelAlign="right">
                <DescLink href={SOURCE_CODE_PAGE} icon="github">
                    {SOURCE_CODE_PAGE}
                </DescLink>
            </ElDescriptionsItem>
            <ElDescriptionsItem label={t(msg => msg.about.label.license)} labelAlign="right">
                <DescLink href="https://github.com/sheepzh/timer/blob/main/LICENSE">
                    MIT License
                </DescLink>
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
                    <a href={webstoreUrl} target="_blank" onClick={() => metaService.saveFlag("rateOpen")}>
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