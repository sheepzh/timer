/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import RouterDatabase from "../../../database/router-database"
import { getAppPageUrl } from "../../../util/constant/url"
import { t } from "../../locale"

const db: RouterDatabase = new RouterDatabase(chrome.storage.local)
const APP_PAGE_URL = getAppPageUrl(false)

const allFunctionLink = document.getElementById('all-function-link')
allFunctionLink.onclick = async () => {
    const historyRoute = await db.getHistory()
    chrome.tabs.create({ url: `${APP_PAGE_URL}#${historyRoute || '/'}` })
}
allFunctionLink.innerText = t(msg => msg.viewMore)