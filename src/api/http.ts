type Option = Omit<RequestInit, "method" | "body">

export type FetchResult<T> = {
    data?: T
    statusCode: number
}

export async function fetchGet(url: string, option?: Option): Promise<Response> {
    try {
        const response = await fetch(url, {
            ...(option || {}),
            method: "GET",
        })
        return response
    } catch (e) {
        console.error("Failed to fetch get", e)
        throw Error(e)
    }
}

export async function fetchPost<T>(url: string, body?: T, option?: Option): Promise<Response> {
    try {
        const response = await fetch(url, {
            ...(option || {}),
            method: "POST",
            body: body ? JSON.stringify(body) : null,
        })
        return response
    } catch (e) {
        console.error("Failed to fetch post", e)
        throw Error(e)
    }
}

export async function fetchPutText(url: string, bodyText?: string, option?: Option): Promise<Response> {
    try {
        const response = await fetch(url, {
            ...(option || {}),
            method: "PUT",
            body: bodyText,
        })
        return response
    } catch (e) {
        console.error("Failed to fetch putText", e)
        throw Error(e)
    }
}

export async function fetchDelete(url: string, option?: Option): Promise<Response> {
    try {
        const response = await fetch(url, {
            ...(option || {}),
            method: "DELETE",
        })
        return response
    } catch (e) {
        console.error("Failed to fetch delete", e)
        throw Error(e)
    }
}

export async function fetchFind(url: string, option?: Option): Promise<Response> {
    try {
        const response = await fetch(url, {
            ...(option || {}),
            method: "PROPFIND",
        })
        return response
    } catch (e) {
        console.error("Failed to fetch propfind", e)
        throw Error(e)
    }
}