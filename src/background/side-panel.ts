/**
 * Copyright (c) 2024-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { IS_MV3 } from "@util/constant/environment"

export default function initSidePanel() {
    if (!IS_MV3) return
    chrome.sidePanel?.setOptions?.({ path: "/static/side.html" })
}