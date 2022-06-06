/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { getAppPageUrl } from "@util/constant/url"
import { t } from "@popup/locale"

const allFunctionLink = document.getElementById('all-function-link')
allFunctionLink.onclick = async () => {
    chrome.tabs.create({ url: getAppPageUrl(false, '/') })
}
allFunctionLink.innerText = t(msg => msg.viewMore)