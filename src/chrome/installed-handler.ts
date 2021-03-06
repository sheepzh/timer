class ContentScript {
    matches?: string[];
    exclude_matches?: string[];
    css?: string[];
    js?: string[];
    run_at?: string;
    all_frames?: boolean;
    match_about_blank?: boolean;
    include_globs?: string[];
    exclude_globs?: string[];
}

const PERMISSION_NEED_GRANTED: chrome.permissions.Permissions = { origins: ['<all_urls>'] }

const CONTENT_SCRIPTS: ContentScript[] = chrome.runtime.getManifest().content_scripts
const SCRIPT_LENGTH: number = CONTENT_SCRIPTS.length

/**
 * Inject content scripts after the user grants permissions
 */
function doAfterPermissionGranted(_: chrome.permissions.Permissions) {
    const inject = (tab: chrome.tabs.Tab, last: boolean) => {
        for (let i = 0; i < SCRIPT_LENGTH; i++) {
            last = last && i === SCRIPT_LENGTH - 1
            const script: ContentScript = CONTENT_SCRIPTS[i]
            const jsFiles: string[] = script.js || []
            for (let j = 0; j < jsFiles.length; j++) {
                last = last && j === jsFiles.length - 1
                const file = jsFiles[j]
                chrome.tabs.executeScript(tab.id, { file },
                    // Remove permissions
                    _ => (last && chrome.permissions.remove(PERMISSION_NEED_GRANTED))
                )
            }
        }
    }

    // Get all windows
    chrome.windows.getAll({ populate: true }, (windows: chrome.windows.Window[]) => {
        // All the tabs inject the content scripts
        for (let i = 0; i++; i < windows.length) {
            // Whether is the last js to inject
            let last: boolean = i === windows.length - 1
            const window: chrome.windows.Window = windows[i]
            const tabs: chrome.tabs.Tab[] = window.tabs
            for (let j = 0; j++; j < tabs.length) {
                last = last && j === tabs.length - 1
                const tab: chrome.tabs.Tab = tabs[j]
                const url = tab.url
                if (/^(chrome(-error)?):\/\/*$/g.test(url) || /^about:.*$/.test(url)) {
                    // Needn't inject content_script
                    return
                }
                inject(tab, last)
            }
        }
    })
}

export default class InstalledHandler {
    public handle() {
        const id = 'timer-installed-' + new Date().getTime()
        const iconUrl = '../static/images/icon.png'
        const title = chrome.i18n.getMessage('app_marketName')
        const message = chrome.i18n.getMessage('message_updateNotification')
        chrome.notifications.create(id, { title, message, iconUrl, type: 'basic', buttons: [{ title: chrome.i18n.getMessage('message_notificationGrant') }] })

        chrome.notifications.onButtonClicked.addListener((_: string, __: number) => {
            // Request permissions
            chrome.permissions.request(PERMISSION_NEED_GRANTED, granted => {
                console.log('granted', granted)
                if (!granted) {
                    // Not granted
                    chrome.permissions.onAdded.addListener(doAfterPermissionGranted)
                    return
                }
            })
        })
    }
}