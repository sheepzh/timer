import { onInstalled } from "@api/chrome/runtime"
import { createTab, listTabs } from "@api/chrome/tab"
import metaService from "@service/meta-service"
import { getGuidePageUrl } from "@util/constant/url"
import { isBrowserUrl } from "@util/pattern"
import UninstallListener from './uninstall-listener'

async function onFirstInstall() {
    createTab(getGuidePageUrl(true))
    metaService.updateInstallTime(new Date())
}

function executeScript(tabId: number, files: string[]) {
    chrome.scripting.executeScript({ target: { tabId }, files }).catch(err => console.log(err))
}

async function reloadContentScript() {
    const files = chrome.runtime.getManifest().content_scripts?.[0]?.js
    if (!files?.length) {
        return
    }
    const tabs = await listTabs()
    tabs.filter(({ url }) => url && !isBrowserUrl(url))
        .forEach(tab => executeScript(tab.id, files))
}

export default function handleInstall() {
    onInstalled(async reason => {
        reason === "install" && await onFirstInstall()
        // Questionnaire for uninstall
        new UninstallListener().listen()
        // Reload content-script
        await reloadContentScript()
    })
}