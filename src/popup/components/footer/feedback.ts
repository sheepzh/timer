import { t } from "../../locale"
import { ZH_FEEDBACK_PAGE } from "../../../util/constant/url"
import { Locale, locale } from "../../../util/i18n"

// 1st. Initialize the feedback link
if (locale === Locale.ZH_CN) {
    const feedbackContainer = document.getElementById('feedback-container')
    const feedbackLink = document.getElementById('feedback-link')
    // Only show feedback if in Chinese
    feedbackContainer.style.display = 'block'
    feedbackLink.innerText = t(msg => msg.feedback)
    feedbackLink.onclick = () => chrome.tabs.create({ url: ZH_FEEDBACK_PAGE })
}