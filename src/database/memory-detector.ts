/**
 * Get the used memory by bytes
 * 
 * @since 0.0.9
 * @param callback 
 */
export function getUsedStorage(callback: (used: number, total: number) => void) {
    const total: number = chrome.storage.local.QUOTA_BYTES
    chrome.storage.local.getBytesInUse(used => callback(used, total))
}