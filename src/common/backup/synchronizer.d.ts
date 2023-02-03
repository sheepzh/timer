/**
 * Copyright (c) 2022-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

declare interface CoordinatorContext<Cache> {
    cid: string
    auth: string
    cache: Cache
    handleCacheChanged: () => Promise<void>
}

declare type Client = {
    id: string
    name: string
    minDate?: string
    maxDate?: string
}

/**
 * Coordinator of data synchronizer
 */
declare interface Coordinator<Cache> {
    /**
     * Register for client
     */
    updateClients(context: CoordinatorContext<Cache>, clients: Client[]): Promise<void>
    /**
     * List all clients
     */
    listAllClients(context: CoordinatorContext<Cache>): Promise<Client[]>
    /**
     * Download fragmented data from cloud
     * 
     * @param targetCid The client id, default value is the local one in context
     */
    download(context: CoordinatorContext<Cache>, yearMonth: string, targetCid?: string): Promise<timer.stat.RowBase[]>
    /**
     * Upload fragmented data to cloud
     * @param rows 
     */
    upload(context: CoordinatorContext<Cache>, rows: timer.stat.RowBase[]): Promise<void>
    /**
     * Test auth
     * 
     * @returns errorMsg or null/undefined
     */
    testAuth(auth: string): Promise<string>
}