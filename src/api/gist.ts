/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import FIFOCache from "@util/fifo-cache"
import { fetchGet, fetchPost } from "./http"

type BaseFile = {
    filename: string
}

export type FileForm = BaseFile & {
    content: string
}

export type File = BaseFile & {
    type: string
    language: string
    raw_url: string
    content?: string
}

type BaseGist<FileInfo> = {
    public: boolean
    description: string
    files: { [filename: string]: FileInfo }
}

export type Gist = BaseGist<File> & {
    id: string
}

export type GistForm = BaseGist<FileForm>

export interface GistAuth {
    token: string
}

const BASE_URL = 'https://api.github.com/gists'

/**
 * Cache of get requests
 */
const GET_CACHE = new FIFOCache<unknown>(20)

async function get<T>(token: string, uri: string): Promise<T> {
    const cacheKey = uri + token
    return await GET_CACHE.getOrSupply(cacheKey, async () => {
        const headers = {
            "Accept": "application/vnd.github+json",
            "Authorization": `token ${token}`
        }
        const url = BASE_URL + uri
        const response = await fetchGet(url, { headers })
        return await response.json()
    }) as T
}

async function post<T, R>(token: string, uri: string, body?: R): Promise<T> {
    const response = await fetchPost<R>(BASE_URL + uri, body, {
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `token ${token}`
        }
    })
    const result = await response.json()
    if (response.status === 200) {
        // Clear cache if success to request
        GET_CACHE.clear()
        return result as T
    }
    throw new Error(JSON.stringify(result))
}

/**
 * @param token token
 * @param id    id
 * @returns detail of Gist
 */
export function getGist(auth: GistAuth, id: string): Promise<Gist> {
    return get(auth.token, `/${id}`);
}

/**
 * Find the first target gist with predicate
 *
 * @param auth     gist token
 * @param predicate predicate
 * @returns
 */
export async function findTarget(auth: GistAuth, predicate: (gist: Gist) => boolean): Promise<Gist> {
    let pageNum = 1
    while (true) {
        const uri = `?per_page=100&page=${pageNum}`
        const gists: Gist[] = await get(auth.token, uri)
        if (!gists?.length) {
            break
        }
        const satisfied = gists.find(predicate)
        if (satisfied) {
            return satisfied
        }
        pageNum += 1
    }
    return undefined
}

/**
 * Create one gist
 *
 * @param auth  auth token
 * @param gist   gist info
 * @returns gist info with id
 */
export function createGist(auth: GistAuth, gist: GistForm): Promise<Gist> {
    return post(auth.token, "", gist)
}

/**
 * Update gist
 *
 * @param token token
 * @param gist  gist
 * @returns
 */
export async function updateGist(auth: GistAuth, id: string, gist: GistForm): Promise<void> {
    await post(auth.token, `/${id}`, gist)
}

/**
 * Get content of file
 */
export async function getJsonFileContent<T>(file: File): Promise<T> {
    const content = file.content
    if (content) {
        try {
            return JSON.parse(content)
        } catch (e) {
            console.warn("Failed to parse content of: " + file.raw_url)
            console.warn(e)
        }
    }
    const rawUrl = file.raw_url
    if (!rawUrl) {
        return undefined
    }
    const response = await fetchGet(rawUrl)
    return await response.json()
}

/**
 * Test token to process gist
 *
 * @returns errorMsg or null/undefined
 */
export async function testToken(auth: GistAuth): Promise<string> {
    const response = await fetchGet(BASE_URL + '?per_page=1&page=1', {
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `token ${auth.token}`
        }
    })
    const { status, statusText } = response || {}
    return status === 200 ? null : statusText || ("ERROR " + status)
}
