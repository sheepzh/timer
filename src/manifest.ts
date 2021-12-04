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
// @ts-ignore
import packageInfo from '../package.json'
import { OPTION_ROUTE } from './app/router/constants'
const { version, author, homepage } = packageInfo as any
const _default: chrome.runtime.ManifestV2 = {
  name: '__MSG_app_marketName__',
  description: "__MSG_app_description__",
  version,
  author,
  default_locale: 'en',
  homepage_url: homepage,
  manifest_version: 2,
  icons: {
    16: "static/images/icon.png",
    48: "static/images/icon.png",
    128: "static/images/icon.png"
  },
  background: {
    scripts: ['background.js'],
    persistent: true
  },
  content_scripts: [
    {
      "matches": [
        "<all_urls>"
      ],
      "js": [
        "content_scripts.js"
      ],
      "run_at": "document_start"
    }
  ],
  permissions: [
    'storage',
    'tabs',
    'webNavigation',
    'contextMenus',
    'chrome://favicon/**',
    /**
     * @since 0.2.2
     **/
    'idle'
  ],
  /**
   * @since 0.3.4
   */
  optional_permissions: [
    'clipboardRead'
  ],
  browser_action: {
    default_popup: "static/popup.html",
    default_icon: "static/images/icon.png"
  },
  /**
   * @since 0.4.0
   */
  options_page: 'static/app.html#' + OPTION_ROUTE
}

export default _default