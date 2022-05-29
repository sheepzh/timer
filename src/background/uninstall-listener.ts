/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import metaService from "@service/meta-service"
import { UNINSTALL_QUESTIONNAIRE } from "@util/constant/url"
import { locale } from "@util/i18n"

/**
 * The percentage for gray
 */
const GRAY_PERCENTAGE = 20

function judgeGray(timeRand: Date) {
    if (!timeRand) {
        return false
    }
    return timeRand.getTime() % 100 < GRAY_PERCENTAGE
}

async function listen() {
    try {
        const installTime = await metaService.getInstallTime()
        const uninstallUrl = UNINSTALL_QUESTIONNAIRE[locale]
        uninstallUrl && judgeGray(installTime) && chrome.runtime.setUninstallURL(uninstallUrl)
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
