export function handleError(scene: string) {
    try {
        const lastError = chrome.runtime.lastError
        lastError && console.log(`Errord when ${scene}: ${lastError.message}`)
    } catch (e) {
        console.info("Can't execute here")
    }
}