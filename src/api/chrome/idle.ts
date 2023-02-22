export function onIdleStateChanged(handler: (idleState: ChromeIdleState) => void) {
    chrome.idle.onStateChanged.addListener(handler)
}