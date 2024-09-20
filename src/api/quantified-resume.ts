import { fetchDelete, fetchGet, fetchPost, fetchPut } from "./http"

const QR_BUILTIN_TYPE = "BrowserTime"
export const DEFAULT_ENDPOINT = "http://localhost:12233"

export type BucketPayload = Pick<timer.backup.Client, 'name' | 'minDate' | 'maxDate'>

export type Bucket = {
    id?: number
    no?: number
    name: string
    builtin: "BrowserTime"
    builtinRefId: string
    status?: "Enabled" | "Disabled"
    desc?: string
    created?: number
    lastModified?: number
    payload?: BucketPayload
}

export type Item = {
    refId: string
    timestamp: number
    name?: string
    action: string
    metrics: {
        visit: number
        focus: number
    }
    payload?: Record<string, any>
}

export type QrRequestContext = {
    endpoint?: string
}

const headers = (): Headers => {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    return headers
}

export const listBuckets = async (ctx: QrRequestContext, clientId?: string): Promise<Bucket[]> => {
    const response = await fetchGet(`${ctx?.endpoint || DEFAULT_ENDPOINT}/api/0/bucket?bt=${QR_BUILTIN_TYPE}&bt_rid=${clientId || ''}`)
    return handleResponseJson(response)
}

export const createBucket = async (ctx: QrRequestContext, bucket: Bucket): Promise<number> => {
    const response = await fetchPost(`${ctx?.endpoint || DEFAULT_ENDPOINT}/api/0/bucket`, bucket, { headers: headers() })
    return handleResponseJson(response)
}

async function handleResponseJson<T>(response: Response): Promise<T> {
    await handleResponse(response)
    return response.json()
}

async function handleResponse(response: Response): Promise<Response> {
    const status = response?.status
    if (status === 200) {
        return
    }
    let resMsg = null
    try {
        resMsg = (await response.json()).message
    } catch { }
    if (resMsg) {
        throw new Error(resMsg)
    }
    if (status === 422) {
        throw new Error("Failed to connect Quantified Resume, please contact the developer")
    } else if (status === 500) {
        throw new Error("Internal server error")
    } else {
        console.error(response)
        throw new Error(`Unexpected status code: ${status}, url=${response.url}`)
    }
}

export const updateBucket = async (ctx: QrRequestContext, bucket: Bucket): Promise<void> => {
    const response = await fetchPut(`${ctx?.endpoint || DEFAULT_ENDPOINT}/api/0/bucket/${bucket?.id}`, bucket, { headers: headers() })
    await handleResponse(response)
}

export const batchCreateItems = async (ctx: QrRequestContext, bucketId: number, items: Item[]): Promise<void> => {
    const response = await fetchPost(`${ctx?.endpoint || DEFAULT_ENDPOINT}/api/0/bucket/${bucketId}/item`, items, { headers: headers() })
    await handleResponse(response)
}

export const listAllItems = async (ctx: QrRequestContext, bucketId: number): Promise<Item[]> => {
    const response = await fetchGet(`${ctx?.endpoint || DEFAULT_ENDPOINT}/api/0/bucket/${bucketId}/item`, { headers: headers() })
    return await handleResponseJson(response)
}

export const removeBucket = async (ctx: QrRequestContext, bucketId: number): Promise<void> => {
    const response = await fetchDelete(`${ctx?.endpoint || DEFAULT_ENDPOINT}/api/0/bucket/${bucketId}?force=true`, { headers: headers() })
    await handleResponse(response)
}