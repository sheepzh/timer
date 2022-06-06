/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { UNINSTALL_QUESTIONNAIRE } from "@util/constant/url"
import { locale } from "@util/i18n"

async function listen() {
    try {
        const uninstallUrl = UNINSTALL_QUESTIONNAIRE[locale]
        uninstallUrl && chrome.runtime.setUninstallURL(uninstallUrl)
    } catch (e) {
        console.error(e)
    }
}

/**
 * @since 0.9.6
 */
export default class UninstallListener {
    listen = listen
}
