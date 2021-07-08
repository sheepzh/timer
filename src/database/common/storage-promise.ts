/**
 * Wrap the storage with promise
 */
export default class StoragePromise {
    private storage: chrome.storage.StorageArea

    constructor(storage: chrome.storage.StorageArea) {
        this.storage = storage
    }

    get(keys?: string | string[] | Object | null): Promise<{ [key: string]: any }> {
        return new Promise(resolve => this.storage.get(keys, resolve))
    }

    set(obj: Object): Promise<void> {
        return new Promise<void>(resolve => this.storage.set(obj, resolve))
    }

    remove(key: string | string[]): Promise<void> {
        return new Promise(resolve => this.storage.remove(key, resolve))
    }

    async getUsedMemory(): Promise<number> {
        if (this.storage.getBytesInUse) {
            return new Promise(resolve => this.storage.getBytesInUse(resolve))
        } else {
            const store = await this.get()
            return JSON.stringify(store).length
        }
    }
}