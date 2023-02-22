export function getUILanguage(): string {
    return chrome.i18n.getUILanguage()
}

// Bug of chrome： 
// chrome.i18n.getMessage may not work in background
// @see https://stackoverflow.com/questions/6089707/calling-chrome-i18n-getmessage-from-a-content-script
export function getMessage(messageName: string): string {
    return chrome.i18n.getMessage(messageName)
}