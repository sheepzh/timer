import { MEAT_URL } from "../../../util/constant/url";
import { Locale, locale } from "../../../util/i18n";
const nowHour = new Date().getHours()

if ((nowHour === 17 || nowHour === 18 || nowHour === 12) && locale === Locale.ZH_CN) {
    const link = document.getElementById('meat-container')
    link.style.display = 'block'
    link.onclick = () => chrome.tabs.create({ url: MEAT_URL })
}