/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Gist, GistForm, File, FileForm } from "@api/gist"

import { getJsonFileContent, findTarget, getGist, createGist, updateGist, testToken } from "@api/gist"
import { SOURCE_CODE_PAGE } from "@util/constant/url"
import { devide2Buckets, gistData2Rows } from "./compressor"

const TIMER_META_GIST_DESC = "Used for timer to save meta info. Don't change this description :)"
const TIMER_DATA_GIST_DESC = "Used for timer to save stat data. Don't change this description :)"

const READEME_FILE_NAME = "README.md"
const CLIENT_FILE_NAME = "clients.json"

const INIT_README_MD: FileForm = {
    filename: READEME_FILE_NAME,
    content: `Created by [TIMER](${SOURCE_CODE_PAGE}) automatically, please DO NOT edit this gist!`
}

const INIT_CLIENT_JSON: FileForm = {
    filename: CLIENT_FILE_NAME,
    content: "[]"
}

/**
 * Local cache of gist 
 */
type Cache = {
    /**
     * Gist id with meta info
     */
    metaGistId: string
    /**
     * Gist id with stat info
     */
    statGistId: string
}

function bucket2filename(bucket: string, cid: string) {
    return `${bucket}_${cid}.json`
}

export default class GistCoordinator implements Coordinator<Cache> {
    async updateClients(context: CoordinatorContext<Cache>, clients: Client[]): Promise<void> {
        const gist = await this.getMetaGist(context)
        if (!gist) {
            return
        }
        const files: { [filename: string]: FileForm } = {}
        files[READEME_FILE_NAME] = INIT_README_MD
        files[CLIENT_FILE_NAME] = {
            filename: CLIENT_FILE_NAME,
            content: JSON.stringify(clients)
        }
        await updateGist(context.auth, gist.id, { description: gist.description, public: false, files })
    }

    async listAllClients(context: CoordinatorContext<Cache>): Promise<Client[]> {
        const gist = await this.getMetaGist(context)
        if (!gist) {
            return []
        }
        const file = gist?.files[CLIENT_FILE_NAME]
        return file ? getJsonFileContent(file) || [] : []
    }

    async download(context: CoordinatorContext<Cache>, yearMonth: string, targetCid?: string): Promise<timer.stat.RowBase[]> {
        const filename = bucket2filename(yearMonth, targetCid || context.cid)
        const gist: Gist = await this.getStatGist(context)
        const file: File = gist.files[filename]
        if (file) {
            const gistData: GistData = await getJsonFileContent(file)
            return gistData2Rows(yearMonth, gistData)
        } else {
            return []
        }
    }

    async upload(context: CoordinatorContext<Cache>, rows: timer.stat.RowBase[]): Promise<void> {
        const cid = context.cid
        const buckets = devide2Buckets(rows)
        const gist = await this.getStatGist(context)
        const files2Update: { [filename: string]: FileForm } = {}
        for (const [bucket, gistData] of buckets) {
            const filename = bucket2filename(bucket, cid)
            let content: string = JSON.stringify(gistData)
            files2Update[filename] = { content, filename }
        }

        const gist2update: GistForm = {
            public: false,
            files: files2Update,
            description: TIMER_DATA_GIST_DESC
        }
        updateGist(context.auth, gist.id, gist2update)
    }

    private isTargetMetaGist(gist: Gist): boolean {
        return gist.description === TIMER_META_GIST_DESC
    }

    private isTargetStatGist(gist: Gist): boolean {
        return gist.description === TIMER_DATA_GIST_DESC
    }

    private async getMetaGist(context: CoordinatorContext<Cache>): Promise<Gist> {
        const gistId = context.cache.metaGistId
        const auth = context.auth
        // 1. Find by id
        if (gistId) {
            const gist = await getGist(auth, gistId)
            if (gist && this.isTargetMetaGist(gist)) {
                return gist
            }
        }
        // 2. Find another
        const anotherGist = await findTarget(auth, gist => this.isTargetMetaGist(gist))
        if (anotherGist) {
            context.cache.metaGistId = anotherGist.id
            context.handleCacheChanged()
            return anotherGist
        }
        // 3. Create new one
        const files = {}
        files[INIT_README_MD.filename] = INIT_README_MD
        files[INIT_CLIENT_JSON.filename] = INIT_CLIENT_JSON
        const gist2Create: GistForm = { description: TIMER_META_GIST_DESC, files, public: false }
        const created = await createGist(auth, gist2Create)
        const newId = created?.id
        newId && (context.cache.metaGistId = newId) && context.handleCacheChanged()
        return created
    }

    private async getStatGist(context: CoordinatorContext<Cache>): Promise<Gist> {
        const gistId = context.cache.statGistId
        const auth = context.auth
        // 1. Find by id
        if (gistId) {
            const gist = await getGist(auth, gistId)
            if (gist && this.isTargetStatGist(gist)) {
                return gist
            }
        }
        // 2. Find another
        const anotherGist = await findTarget(auth, gist => this.isTargetStatGist(gist))
        if (anotherGist) {
            context.cache.statGistId = anotherGist.id
            context.handleCacheChanged()
            return anotherGist
        }
        // 3. Create new one
        const files = {}
        files[READEME_FILE_NAME] = INIT_README_MD
        const gist2Create: GistForm = { description: TIMER_DATA_GIST_DESC, files, public: false }
        const created = await createGist(auth, gist2Create)
        const newId = created?.id
        newId && (context.cache.statGistId = newId) && context.handleCacheChanged()
        return created
    }

    testAuth(auth: string): Promise<string> {
        return testToken(auth)
    }
}
