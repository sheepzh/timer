export function handleError(scene: string): string {
    try {
        const lastError = chrome.runtime.lastError
        lastError && console.log(`Errored when ${scene}: ${lastError.message}`)
        return lastError?.message
    } catch (e) {
        console.info("Can't execute here")
    }
    return null
}