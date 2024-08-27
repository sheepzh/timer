 /**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { AxiosResponse } from "axios"

import { CROWDIN_PROJECT_ID } from "@util/constant/url"
import axios from "axios"

/**
 * Used to obtain translation status
 */
const PUBLIC_TOKEN = '5e0d53accb6e8c490a1af2914c0963f78082221d7bc1dcb0d56b8e3856a875e432a2e353a948688e'

export type TranslationStatusInfo = {
    /**
    * https://developer.crowdin.com/language-codes/
    */
    languageId: string
    translationProgress: number
}

export type MemberInfo = {
    username: string
    joinedAt: string
    avatarUrl: string
}

export async function getTranslationStatus(): Promise<TranslationStatusInfo[]> {
    const limit = 500
    const auth = `Bearer ${PUBLIC_TOKEN}`
    const url = `https://api.crowdin.com/api/v2/projects/${CROWDIN_PROJECT_ID}/languages/progress?limit=${limit}`
    const response: AxiosResponse = await axios.get(url, {
        headers: { "Authorization": auth }
    })
    const data: { data: { data: TranslationStatusInfo }[] } = response.data
    return data.data.map(i => i.data)
}

export async function getMembers(): Promise<MemberInfo[]> {
    const limit = 20
    const auth = `Bearer ${PUBLIC_TOKEN}`
    const url = `https://api.crowdin.com/api/v2/projects/${CROWDIN_PROJECT_ID}/members?limit=${limit}`
    const response: AxiosResponse = await axios.get(url, {
        headers: { "Authorization": auth }
    })
    const data: { data: { data: MemberInfo }[] } = response.data
    return data.data.map(i => i.data)
}