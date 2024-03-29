/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * Build the manifest.json in chrome extension directory via this file
 *
 * @author zhy
 * @since 0.0.1
 */
// Not use path alias in manifest.json
import packageInfo from "./package"
const { version, author: { name: authorName }, homepage } = packageInfo

const _default: chrome.runtime.ManifestFirefox = {
    name: '__MSG_meta_marketName__',
    description: "__MSG_meta_description__",
    version,
    author: authorName,
    default_locale: 'en',
    homepage_url: homepage,
    manifest_version: 2,
    icons: {
        16: "static/images/icon.png",
        48: "static/images/icon.png",
        128: "static/images/icon.png",
    },
    background: {
        scripts: ['background.js'],
        persistent: true,
    },
    content_scripts: [
        {
            matches: [
                "<all_urls>"
            ],
            js: [
                "content_scripts.js"
            ],
            run_at: "document_start"
        }
    ],
    permissions: [
        'storage',
        'tabs',
        'contextMenus',
        'alarms',
        "<all_urls>",
    ],
    browser_action: {
        default_popup: "static/popup.html",
        default_icon: "static/images/icon.png",
    },
}

export default _default
