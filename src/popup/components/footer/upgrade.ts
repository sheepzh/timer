/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getLatestVersion } from "@src/api/version"
import packageInfo from "@src/package"
import { t } from "@popup/locale"
import { UPDATE_PAGE } from "@util/constant/url"
import { IS_FIREFOX } from "@util/constant/environment"
import { IS_FROM_STORE } from "@util/constant/meta"

function showUpgradeButton(latestVersion: string) {
    const upgrade = document.getElementById('upgrade-container')
    const upgradeLink = document.getElementById('upgrade-link')
    const upgradePopup = document.getElementById('upgrade-popup-container')
    const latestInfo = document.getElementById('latest-info')

    upgrade.style.display = 'block'
    upgrade.onmouseover = () => upgradePopup.style.display = 'block'
    upgrade.onmouseout = () => upgradePopup.style.display = 'none'

    upgradeLink.innerText = t(msg => msg.updateVersion)
    const versionLabel = `v${latestVersion}`
    if (IS_FIREFOX) {
        // Can't jump to about:addons in Firefox
        // So no jump, only show tooltip text
        upgrade.classList.add("firefox-upgrade-no-underline")
        latestInfo.innerText = t(msg => msg.updateVersionInfo4Firefox, { version: versionLabel })
    } else {
        upgradeLink.onclick = () => chrome.tabs.create({ url: UPDATE_PAGE })
        latestInfo.innerText = t(msg => msg.updateVersionInfo, { version: versionLabel })
    }
}

getLatestVersion()
    .then(latestVersion => latestVersion
        && packageInfo.version !== latestVersion
        // Must from store
        && IS_FROM_STORE
        && showUpgradeButton(latestVersion)
    )