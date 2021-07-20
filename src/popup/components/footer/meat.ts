import { Locale, locale } from "../../../util/i18n";
const nowHour = new Date().getHours()

if ((nowHour === 17 || nowHour === 18 || nowHour === 12) && locale === Locale.ZH_CN) {
    document.getElementById('meat-container').style.display = 'block'
}