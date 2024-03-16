import { t } from "@app/locale"
import { CHROME_HOMEPAGE, EDGE_HOMEPAGE, FEEDBACK_QUESTIONNAIRE, getHomepageWithLocale, GITHUB_ISSUE_ADD, HOMEPAGE, SOURCE_CODE_PAGE, WEBSTORE_PAGE } from "@util/constant/url"
import { ElCard, ElDescriptions, ElDescriptionsItem, ElDivider, ElLink, ElSpace, ElText } from "element-plus"
import { defineComponent, StyleValue } from "vue"
import InstallationLink from "./InstallationLink"
import packageInfo from "@src/package"
import { locale } from "@i18n"
import "./description.sass"

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
                <ElLink href={getHomepageWithLocale()} target="_blank">
                    {HOMEPAGE}
                </ElLink>
            </ElDescriptionsItem>
            <ElDescriptionsItem label={t(msg => msg.about.label.sourceCode)} labelAlign="right">
                <ElLink href={SOURCE_CODE_PAGE} target="_blank">
                    {SOURCE_CODE_PAGE}
                </ElLink>
            </ElDescriptionsItem>
            <ElDescriptionsItem label={t(msg => msg.about.label.installation)} labelAlign="right">
                <div style={INSTALLATION_STYLE}>
                    <InstallationLink href={CHROME_HOMEPAGE} name="Chrome" source="chrome" />
                    <ElSpace />
                    <InstallationLink href={EDGE_HOMEPAGE} name="Edge" source="edge" />
                    <ElSpace />
                    <InstallationLink href={EDGE_HOMEPAGE} name="Firefox" source="firefox" />
                </div>
            </ElDescriptionsItem>
            <ElDescriptionsItem label={t(msg => msg.about.label.thanks)} labelAlign="right">
                <div>
                    <ElLink href="https://vuejs.org/" target="_blank">VueJS</ElLink>
                </div>
                <div>
                    <ElLink href="https://echarts.apache.org/" target="_blank">Echarts</ElLink>
                </div>
                <div>
                    <ElLink href="https://element-plus.org/" target="_blank">Element Plus</ElLink>
                </div>
            </ElDescriptionsItem>
        </ElDescriptions>
        <ElDivider />
        <div class="text-container">
            <div>
                <ElText size="large">
                    🌟&ensp;
                    {t(msg => msg.about.text.greet)}&ensp;
                    <a href={webstoreUrl} target="_blank">{t(msg => msg.about.text.rate)}</a>
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