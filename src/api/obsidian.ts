/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { fetchDelete, fetchGet, fetchPutText } from "./http"

export const DEFAULT_ENDPOINT = "http://127.0.0.1:27123"
export const INVALID_AUTH_CODE = 40101
export const NOT_FOUND_CODE = 40400

export type ObsidianResult<T> = {
    message?: string
    errorCode?: number
} & T

export interface ObsidianAuth {
    token: string
}
export type ObsidianRequestContext = {
    endpoint?: string
    auth: ObsidianAuth
}

const authHeaders = (auth: ObsidianAuth) => ({
    "Authorization": `Bearer ${auth.token}`
})

export async function listAllFiles(context: ObsidianRequestContext, dirPath: string): Promise<ObsidianResult<{ files: string[] }>> {
    const { endpoint, auth } = context || {}
    const url = `${endpoint || DEFAULT_ENDPOINT}/vault/${dirPath || ''}`
    const response = await fetchGet(url, { headers: authHeaders(auth) })
    return await response?.json()
}

export async function updateFile(context: ObsidianRequestContext, filePath: string, content: string): Promise<void> {
    const { endpoint, auth } = context || {}
    const url = `${endpoint || DEFAULT_ENDPOINT}/vault/${filePath}`
    const headers = authHeaders(auth)
    headers["Content-Type"] = "text/markdown"
    await fetchPutText(url, content, { headers })
}

export async function getFileContent(context: ObsidianRequestContext, filePath: string): Promise<string> {
    const { endpoint, auth } = context || {}
    const url = `${endpoint || DEFAULT_ENDPOINT}/vault/${filePath}`
    const headers = authHeaders(auth)
    const response = await fetchGet(url, { headers })
    const { status } = response
    return status >= 200 && status < 300 ? await response.text() : null
}

export async function deleteFile(context: ObsidianRequestContext, filePath: string): Promise<void> {
    const { endpoint, auth } = context || {}
    const url = `${endpoint || DEFAULT_ENDPOINT}/vault/${filePath}`
    const headers = authHeaders(auth)
    const response = await fetchDelete(url, { headers })
    if (response.status !== 200) {
        console.log(`Failed to delete file of Obsidian. filePath=${filePath}`)
    }
}