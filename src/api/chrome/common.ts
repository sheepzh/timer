export function handleError(scene: string, e?: any): string {
    try {
        const lastError = chrome.runtime.lastError ?? e
        lastError && console.log(`Errored when ${scene}: ${lastError?.message}`)
        return lastError?.message
    } catch (e) {
        console.info("Can't execute here")
    }
    return null
}