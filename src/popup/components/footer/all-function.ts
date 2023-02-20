/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getAppPageUrl } from "@util/constant/url"
import { t } from "@popup/locale"
import { createTab } from "@api/chrome/tab"

function initAllFunction() {
    const allFunctionLink = document.getElementById('all-function-link')
    allFunctionLink.onclick = () => createTab(getAppPageUrl(false, '/'))
    allFunctionLink.innerText = t(msg => msg.base.allFunction)
}

export default initAllFunction