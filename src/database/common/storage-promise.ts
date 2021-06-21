/**
 * Wrap the storage with promise
 */
export default class StoragePromise {
    private storage: chrome.storage.StorageArea

    constructor(storage: chrome.storage.StorageArea) {
        this.storage = storage
    }

    public get(keys: string | string[] | Object | null): Promise<{ [key: string]: any }> {
        return new Promise(resolve => this.storage.get(keys, resolve))
    }

    public set(obj: Object): Promise<void> {
        return new Promise<void>(resolve => this.storage.set(obj, resolve))
    }

    public remove(key: string | string[]): Promise<void> {
        return new Promise(resolve => this.storage.remove(key, resolve))
    }
}