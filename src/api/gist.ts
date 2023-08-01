/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { AxiosError, AxiosResponse } from "axios"

import FIFOCache from "@util/fifo-cache"

import axios from "axios"

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

const BASE_URL = 'https://api.github.com/gists'

/**
 * Cache of get requests
 */
const GET_CACHE = new FIFOCache<AxiosResponse>(20)

async function get<T>(token: string, uri: string): Promise<T> {
    const headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": `token ${token}`
    }
    const cacheKey = uri + token
    return GET_CACHE.getOrSupply(cacheKey, () => axios.get(BASE_URL + uri, { headers }))
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.data as T
            } else {
                return null
            }
        }).catch((error: AxiosError) => {
            console.log("AxisError", error)
            return null
        })
}

async function post<T, R>(token: string, uri: string, body?: R): Promise<T> {
    return new Promise(resolve => axios.post(BASE_URL + uri, body,
        {
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `token ${token}`
            }
        }
    ).then(response => {
        // Clear cache if success to request
        GET_CACHE.clear()
        if (response.status >= 200 && response.status < 300) {
            return resolve(response.data as T)
        } else {
            return resolve(null)
        }
    }).catch((error: AxiosError) => {
        console.log("AxisError", error)
        resolve(null)
    }))
}

/**
 * @param token token
 * @param id    id
 * @returns detail of Gist
 */
export function getGist(token: string, id: string): Promise<Gist> {
    return get(token, `/${id}`)
}

/**
 * Find the first target gist with predicate
 * 
 * @param token     gist token
 * @param predicate predicate
 * @returns 
 */
export async function findTarget(token: string, predicate: (gist: Gist) => boolean): Promise<Gist> {
    let pageNum = 1
    while (true) {
        const uri = `?per_page=100&page=${pageNum}`
        const gists: Gist[] = await get(token, uri)
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
 * @param token  token
 * @param gist   gist info
 * @returns gist info with id
 */
export function createGist(token: string, gist: GistForm): Promise<Gist> {
    return post(token, "", gist)
}

/**
 * Update gist
 * 
 * @param token token
 * @param gist  gist
 * @returns 
 */
export async function updateGist(token: string, id: string, gist: GistForm): Promise<void> {
    await post(token, `/${id}`, gist)
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
    const response = await axios.get(rawUrl)
    return response.data
}

/**
 * Test token to process gist
 * 
 * @returns errorMsg or null/undefined
 */
export async function testToken(token: string): Promise<string> {
    return new Promise(resolve => {
        axios.get(BASE_URL + '?per_page=1&page=1', {
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `token ${token}`
            }
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                resolve(undefined)
            } else {
                resolve(response.data?.message || 'Unknown error')
            }
        }).catch((error: AxiosError) => resolve((error.response?.data as any)?.message || 'Unknown error'))
    })
}
