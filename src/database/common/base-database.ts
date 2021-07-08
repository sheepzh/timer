import StoragePromise from "./storage-promise"

export default abstract class BaseDatabase {
    storage: StoragePromise
    constructor(storageArea: chrome.storage.StorageArea) {
        this.storage = new StoragePromise(storageArea)
    }

    /**
     * @since 0.2.2
     * @param key key
     * @param obj data
     * @returns 
     */
    protected setByKey(key: string, obj: Object): Promise<void> {
        const toUpdate = {}
        toUpdate[key] = obj
        return this.storage.set(toUpdate)
    }

    /**
     * Import data
     * 
     * @since 0.2.5
     * @param data backup data
     */
    abstract importData(data: any): Promise<void>
}