/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getLatestVersion } from "@api/version"
import packageInfo from "@src/package"
import { t } from "@popup/locale"
import { REVIEW_PAGE, UPDATE_PAGE } from "@util/constant/url"
import { IS_FIREFOX } from "@util/constant/environment"
import { IS_FROM_STORE } from "@util/constant/meta"
import { createTab } from "@api/chrome/tab"
import metaService from "@service/meta-service"

/**
 * Reset the position after upgrade showed
 *
 * @param upgrade upgrade button
 * @param upgradePopup label popup
 */
function observeUpgradeShowed(upgrade: HTMLElement, upgradePopup: HTMLElement) {
    const observer = new MutationObserver(mutationList => mutationList.forEach(mutation => {
        const causedByUpgradedDisplay = mutation.oldValue === "display: none"
            && getComputedStyle(upgrade)?.getPropertyValue?.("display") === "block"
        if (!causedByUpgradedDisplay) {
            return
        }
        // Init the position of upgrade popup
        const x = upgrade.getBoundingClientRect?.()?.left || 0 + window.scrollX || 0
        x && (upgradePopup.style.transform = `translate(${x}px, -52px)`)
    }))

    observer.observe(upgrade, { attributes: true, attributeFilter: ["style"], attributeOldValue: true })

    window.addEventListener("unload", () => {
        observer?.disconnect()
        observer?.takeRecords()
    })
}

function showUpgradeButton(latestVersion: string) {
    const upgrade = document.getElementById('upgrade-container')
    const upgradeLink = document.getElementById('upgrade-link')
    const upgradePopup = document.getElementById('upgrade-popup-container')
    const latestInfo = document.getElementById('latest-info')
    observeUpgradeShowed(upgrade, upgradePopup)

    upgrade.style.display = 'block'
    upgrade.onmouseover = () => upgradePopup.style.display = 'block'
    upgrade.onmouseout = () => upgradePopup.style.display = 'none'

    upgradeLink.innerText = t(msg => msg.footer.updateVersion)
    const versionLabel = `v${latestVersion}`
    if (IS_FIREFOX) {
        // Can't jump to about:addons in Firefox
        // So no jump, only show tooltip text
        upgrade.classList.add("firefox-upgrade-no-underline")
        latestInfo.innerText = t(msg => msg.footer.updateVersionInfo4Firefox, { version: versionLabel })
    } else {
        upgradeLink.onclick = () => createTab(UPDATE_PAGE)
        latestInfo.innerText = t(msg => msg.footer.updateVersionInfo, { version: versionLabel })
    }
}

function showRateButton() {
    const rate = document.getElementById('rate-container')
    const rateLink = document.getElementById('rate-link')
    rate.style.display = 'inline-flex'
    rateLink.innerText = t(msg => msg.footer.rate)
    rateLink.onclick = async () => {
        await metaService.saveFlag("rateOpen")
        createTab(REVIEW_PAGE)
    }
}

async function initUpgrade() {
    let latestVersion = null
    try {
        latestVersion = await getLatestVersion()
    } catch { }
    const needShowUpgrade = latestVersion && packageInfo.version !== latestVersion && IS_FROM_STORE
    if (needShowUpgrade) {
        showUpgradeButton(latestVersion)
    } else if (await metaService.recommendRate()) {
        showRateButton()
    }
}

export default initUpgrade
