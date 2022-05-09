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
import { OPTION_ROUTE } from "./app/router/constants"
const { version, author, homepage } = packageInfo
const _default: chrome.runtime.ManifestV3 = {
  name: '__MSG_app_marketName__',
  description: "__MSG_app_description__",
  version,
  author,
  default_locale: 'en',
  homepage_url: homepage,
  manifest_version: 3,
  icons: {
    16: "static/images/icon.png",
    48: "static/images/icon.png",
    128: "static/images/icon.png"
  },
  background: {
    service_worker: 'background.js',
    type: "module"
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
    /**
     * @since 0.2.2
     **/
    'idle'
  ],
  host_permissions: [
    'chrome://favicon/**',
  ],
  /**
   * @since 0.3.4
   */
  optional_permissions: [
    'clipboardRead'
  ],
  action: {
    default_popup: "static/popup.html",
    default_icon: "static/images/icon.png"
  },
  /**
   * @since 0.4.0
   */
  options_page: 'static/app.html#' + OPTION_ROUTE
}

export default _default