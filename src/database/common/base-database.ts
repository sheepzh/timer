import StoragePromise from "./storage-promise"

export default class BaseDatabase {
    storage: StoragePromise
    constructor(storageArea: chrome.storage.StorageArea) {
        this.storage = new StoragePromise(storageArea)
    }
}