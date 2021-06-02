/**
 * User memory of this extension
 */
export declare type MemoryInfo = {
    /**
     * Used bytes
     */
    used: number
    /**
     * Total bytes
     */
    total: number
}

const total: number = chrome.storage.local.QUOTA_BYTES

/**
 * Get the used memory by bytes
 * 
 * @since 0.0.9
 */
export function getUsedStorage(): Promise<MemoryInfo> {
    return new Promise(
        resolve => chrome.storage.local.getBytesInUse(used => resolve({ used, total }))
    )
}