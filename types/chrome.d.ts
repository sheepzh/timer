/**
 * ABBRs for namespace chrome
 */
// chrome.tabs
declare type ChromeTab = chrome.tabs.Tab
declare type ChromeTabActiveInfo = chrome.tabs.TabActiveInfo
declare type ChromeTabChangeInfo = chrome.tabs.TabChangeInfo
// chrome.windows
declare type ChromeWindow = chrome.windows.Window
// chrome.contextMenus
declare type ChromeContextMenuCreateProps = chrome.contextMenus.CreateProperties
declare type ChromeContextMenuUpdateProps = chrome.contextMenus.UpdateProperties
// chrome.alarms
declare type ChromeAlarm = chrome.alarms.Alarm
// chrome.runtime
declare type ChromeOnInstalledReason = chrome.runtime.OnInstalledReason
declare type ChromeMessageSender = chrome.runtime.MessageSender
declare type ChromeMessageHandler<T = any, R = any> = (req: timer.mq.Request<T>, sender: ChromeMessageSender) => Promise<timer.mq.Response<R>>

declare namespace chrome {
    namespace runtime {
        type ManifestFirefox = Omit<ManifestV2, "author"> & {
            // "author" must be string for Firefox
            author?: string
            browser_specific_settings?: {
                gecko?: {
                    id?: string
                }
            }
        }
    }
}