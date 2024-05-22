/**
 * @since 1.2.0
 */
declare namespace timer.backup {

    type Client = {
        id: string
        name: string
        minDate?: string
        maxDate?: string
    }

    interface CoordinatorContext<Cache, Auth = {}> {
        cid: string
        auth: Auth
        ext?: TypeExt
        cache: Cache
        handleCacheChanged: () => Promise<void>
    }

    /**
     * timer.backup.Coordinator of data synchronizer
     */
    interface Coordinator<Cache, Auth = {}> {
        /**
         * Register for client
         */
        updateClients(context: timer.backup.CoordinatorContext<Cache>, clients: Client[]): Promise<void>
        /**
         * List all clients
         */
        listAllClients(context: timer.backup.CoordinatorContext<Cache>): Promise<Client[]>
        /**
         * Download fragmented data from cloud
         *
         * @param targetCid The client id, default value is the local one in context
         */
        download(context: timer.backup.CoordinatorContext<Cache>, dateStart: Date, dateEnd: Date, targetCid?: string): Promise<timer.stat.RowBase[]>
        /**
         * Upload fragmented data to cloud
         * @param rows
         */
        upload(context: timer.backup.CoordinatorContext<Cache>, rows: timer.stat.RowBase[]): Promise<void>
        /**
         * Test auth
         *
         * @returns errorMsg or null/undefined
         */
        testAuth(auth: Auth, ext: timer.backup.TypeExt): Promise<string>
        /**
         * Clear data
         */
        clear(context: timer.backup.CoordinatorContext<Cache>, client: timer.backup.Client): Promise<void>
    }

    type Type =
        | 'none'
        | 'gist'
        // Sync into Obsidian via its plugin Local REST API
        // @since 1.9.4
        | 'obsidian_local_rest_api'
        // @since 2.3
        | 'webdav'

    type TypeExt = {
        endpoint?: string
        dirPath?: string
    }

    /**
     * Snapshot of last backup
     */
    type Snapshot = {
        /**
         * Timestamp
         */
        ts: number
        /**
         * The date of the ts
         */
        date: string
    }

    /**
     * Snapshot cache
     */
    type SnapshotCache = Partial<{
        [type in Type]: Snapshot
    }>

    type MetaCache = Partial<Record<Type, unknown>>
}