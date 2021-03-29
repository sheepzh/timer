/**
 * Build the manifest.json in chrome extension directory via this file
 * 
 * @author zhy
 * @since 0.0.1
 */
const { version, author, homepage } = require('../package.json')
const { defaultLocale } = require('./locale/index')
module.exports = {
  name: '__MSG_app_marketName__',
  description: "__MSG_app_description__",
  version,
  author,
  default_locale: defaultLocale,
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
  ],
  browser_action: {
    default_popup: "static/popup.html",
    default_icon: "static/images/icon.png"
  }
}