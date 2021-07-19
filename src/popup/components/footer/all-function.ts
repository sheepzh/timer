import { APP_PAGE_URL } from "../../../util/constant/url"
import { t } from "../../locale"

const allFunctionLink = document.getElementById('all-function-link')
allFunctionLink.onclick = () => chrome.tabs.create({ url: APP_PAGE_URL })
allFunctionLink.innerText = t(msg => msg.viewMore)