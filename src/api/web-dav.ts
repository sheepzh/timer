/**
 * WebDAV client api
 *
 * Testing with server implemented by https://github.com/svtslv/webdav-cli
 */
import { encode } from 'js-base64'
import { fetchDelete, fetchGet } from './http'

// Only support password for now
export type WebDAVAuth = {
    type: 'password'
    username: string
    password: string
}

export type WebDAVContext = {
    auth: WebDAVAuth
    endpoint: string
}

const authHeaders = (auth: WebDAVAuth): Headers => {
    const type = auth?.type
    let headerVal = null
    if (type === 'password') {
        headerVal = `Basic ${encode(`${auth?.username}:${auth?.password}`)}`
    }
    const headers = new Headers()
    headers.set('Authorization', headerVal)
    return headers
}

export async function judgeDirExist(context: WebDAVContext, dirPath: string): Promise<boolean> {
    const { auth, endpoint } = context || {}
    const headers = authHeaders(auth)
    const url = `${endpoint}/${dirPath}`
    const method = 'PROPFIND'
    headers.append('Accept', 'text/plain,application/xml')
    headers.append('Depth', '1')
    const response = await fetch(url, { method, headers })
    const status = response?.status
    if (status == 207) {
        return true
    } else if (status === 300) {
        throw new Error("Your server does't support PROPFIND method!")
    } else if (status == 404) {
        return false
    } else if (status == 401) {
        throw new Error("Authorization is invalid!")
    } else {
        throw new Error("Unknown directory status")
    }
}

export async function makeDir(context: WebDAVContext, dirPath: string) {
    const { auth, endpoint } = context || {}
    const url = `${endpoint}/${dirPath}`
    const headers = authHeaders(auth)
    const response = await fetch(url, { method: 'MKCOL', headers })
    handleWriteResponse(response)
}

export async function deleteDir(context: WebDAVContext, dirPath: string) {
    const { auth, endpoint } = context || {}
    const url = `${endpoint}/${dirPath}`
    const headers = authHeaders(auth)
    const response = await fetchDelete(url, { headers })
    const status = response.status
    if (status === 403) {
        throw new Error("Unauthorized to delete directory")
    }
    if (status !== 201 && status !== 200) {
        throw new Error("Failed to delete directory: " + status)
    }
}

export async function writeFile(context: WebDAVContext, filePath: string, content: string): Promise<void> {
    const { auth, endpoint } = context || {}
    const headers = authHeaders(auth)
    headers.set("Content-Type", "application/octet-stream")
    const url = `${endpoint}/${filePath}`
    const response = await fetch(url, { headers, method: 'put', body: content })
    handleWriteResponse(response)
}

function handleWriteResponse(response: Response) {
    const status = response.status
    if (status === 403) {
        throw new Error("Unauthorized to write file or create directory")
    }
    if (status !== 201 && status !== 200) {
        throw new Error("Failed to write file or create directory: " + status)
    }
}

export async function readFile(context: WebDAVContext, filePath: string): Promise<string> {
    const { auth, endpoint } = context || {}
    const headers = authHeaders(auth)
    const url = `${endpoint}/${filePath}`
    try {
        const response = await fetchGet(url, { headers })
        const status = response?.status
        if (status === 200) {
            return response.text()
        }
        if (status !== 404) {
            console.warn("Unexpected status: " + status)
        }
        return null
    } catch (e) {
        console.error("Failed to read WebDAV content", e)
        return null
    }
}