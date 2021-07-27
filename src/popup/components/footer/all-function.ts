import RouterDatabase from "../../../database/router-database"
import { APP_PAGE_URL } from "../../../util/constant/url"
import { t } from "../../locale"

const db: RouterDatabase = new RouterDatabase(chrome.storage.local)

const allFunctionLink = document.getElementById('all-function-link')
allFunctionLink.onclick = async () => {
    const historyRoute = await db.getHistory()
    chrome.tabs.create({ url: `${APP_PAGE_URL}#${historyRoute || '/'}` })
}
allFunctionLink.innerText = t(msg => msg.viewMore)