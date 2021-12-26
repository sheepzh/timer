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

function showUpgradeButton(latestVersion: string) {
    const upgrade = document.getElementById('upgrade-container')
    const upgradeLink = document.getElementById('upgrade-link')
    const upgradePopup = document.getElementById('upgrade-popup-container')
    const latestInfo = document.getElementById('latest-info')

    upgrade.style.display = 'block'
    upgrade.onmouseover = () => upgradePopup.style.display = 'block'
    upgrade.onmouseout = () => upgradePopup.style.display = 'none'

    upgradeLink.innerText = t(msg => msg.updateVersion)
    upgradeLink.onclick = () => chrome.tabs.create({ url: UPDATE_PAGE })
    latestInfo.innerText = t(msg => msg.updateVersionInfo, { version: `v${latestVersion}` })
}

getLatestVersion().then(latestVersion => packageInfo.version !== latestVersion && showUpgradeButton(latestVersion))