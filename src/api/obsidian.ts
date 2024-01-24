/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import axios, { AxiosError, AxiosHeaders } from "axios"

export const DEFAULT_ENDPOINT = "http://127.0.0.1:27123"
export const INVALID_AUTH_CODE = 40101
export const NOT_FOUND_CODE = 40400

export type ObsidianResult<T> = {
    message?: string
    errorCode?: number
} & T

export type ObsidianRequestContext = {
    endpoint?: string
    auth: string
}

const authHeaders = (auth: string) => {
    const headers = new AxiosHeaders()
    headers.setAuthorization(`Bearer ${auth}`, true)
    return headers
}

export async function listAllFiles(context: ObsidianRequestContext, dirPath: string): Promise<ObsidianResult<{ files: string[] }>> {
    const { endpoint, auth } = context || {}
    const url = `${endpoint || DEFAULT_ENDPOINT}/vault/${dirPath || ''}`
    const response = await axios.get(url, { headers: authHeaders(auth) })
    return response?.data
}

export function updateFile(context: ObsidianRequestContext, filePath: string, content: string): Promise<void> {
    const { endpoint, auth } = context || {}
    const url = `${endpoint || DEFAULT_ENDPOINT}/vault/${filePath}`
    const headers = authHeaders(auth)
    headers.setContentType("text/markdown")
    return axios.put(url, content, {
        headers
    })
}

export function getFileContent(context: ObsidianRequestContext, filePath: string): Promise<string> {
    return new Promise(resolve => {
        const { endpoint, auth } = context || {}
        const url = `${endpoint || DEFAULT_ENDPOINT}/vault/${filePath}`
        const headers = authHeaders(auth)
        headers.setContentType("text/markdown")
        axios.get(url, { headers }).then(response => {
            resolve(response.data)
        }).catch(e => {
            const status = (e as AxiosError)?.response?.status
            if (status !== 404) {
                console.log("Failed to query file content of Obsidian", e)
            }
            resolve(null)
        })
    })

}

export function deleteFile(context: ObsidianRequestContext, filePath: string): Promise<void> {
    return new Promise(resolve => {
        const { endpoint, auth } = context || {}
        const url = `${endpoint || DEFAULT_ENDPOINT}/vault/${filePath}`
        const headers = authHeaders(auth)
        axios.delete(url, { headers }).then(response => {
            resolve()
        }).catch(e => {
            console.log(`Failed to delete file of Obsidian. filePath=${filePath}`, e)
            resolve()
        })
    })
}