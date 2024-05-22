/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

// @ts-ignore
import { Base64 } from "js-base64"

import { fetchDelete, fetchFind, fetchGet, fetchPutText } from "./http"
import { ResultUtil, Result } from "./utils"

export const DEFAULT_ENDPOINT = "https://api.mahoo12138.cn/webdav"
export const INVALID_AUTH_CODE = 401
export const NOT_FOUND_CODE = 404

export interface WebDAVAuth {
    username: string
    password: string
}

export type WebdavRequestContext = {
    endpoint?: string
    auth: WebDAVAuth
}

const authHeaders = (auth: WebdavRequestContext["auth"]) => {
    const authString = Base64.encode(auth.username + ":" + auth.password)
    return {
        Authorization: `Basic ${authString}`,
    }
}

export async function listAllFiles(
    context: WebdavRequestContext,
    dirPath: string
): Promise<Result<string>> {
    const { endpoint, auth } = context || {}
    const url = `${endpoint || DEFAULT_ENDPOINT}/${dirPath || ""}`
    const response = await fetchFind(url, {
        headers: { ...authHeaders(auth), Depth: "1" },
    })
    let message = ""
    if (response.status === 207) {
        const data = await response.text()
        return ResultUtil.success(data)
    } else if (response.status === 404) {
        message = "Not Found"
    } else if (response.status === 401) {
        message = "unAuth"
    } else {
        message = "Unknown error"
    }
    return ResultUtil.error(message)
}

export async function updateFile(
    context: WebdavRequestContext,
    filePath: string,
    content: string
): Promise<void> {
    const { endpoint, auth } = context || {}
    const url = `${endpoint || DEFAULT_ENDPOINT}/${filePath}`
    const headers = authHeaders(auth)
    headers["Content-Type"] = "text/markdown"
    await fetchPutText(url, content, { headers })
}

export async function getFileContent(
    context: WebdavRequestContext,
    filePath: string
): Promise<string | null> {
    const { endpoint, auth } = context || {}
    const url = `${endpoint || DEFAULT_ENDPOINT}/${filePath}`
    const headers = authHeaders(auth)
    const response = await fetchGet(url, { headers })
    const { status } = response
    return status >= 200 && status < 300 ? await response.text() : null
}

export async function deleteFile(
    context: WebdavRequestContext,
    filePath: string
): Promise<void> {
    const { endpoint, auth } = context || {}
    const url = `${endpoint || DEFAULT_ENDPOINT}/${filePath}`
    const headers = authHeaders(auth)
    const response = await fetchDelete(url, { headers })
    if (response.status !== 200) {
        console.log(`Failed to delete file of Obsidian. filePath=${filePath}`)
    }
}
