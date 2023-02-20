/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { UNINSTALL_QUESTIONNAIRE } from "@util/constant/url"
import { locale } from "@i18n"
import { setUninstallURL } from "@api/chrome/runtime"

async function listen() {
    try {
        const uninstallUrl = UNINSTALL_QUESTIONNAIRE[locale]
        uninstallUrl && setUninstallURL(uninstallUrl)
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
