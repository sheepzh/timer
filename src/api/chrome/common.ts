export function handleError(scene: string) {
    try {
        const lastError = chrome.runtime.lastError
        lastError && console.log(`Errored when ${scene}: ${lastError.message}`)
    } catch (e) {
        console.info("Can't execute here")
    }
}