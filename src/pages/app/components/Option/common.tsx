/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Router, useRoute } from "vue-router"

export const ALL_CATEGORIES = ["appearance", "statistics", "popup", 'dailyLimit', 'accessibility', 'backup'] as const
export type OptionCategory = typeof ALL_CATEGORIES[number]

export type OptionInstance = {
    reset: () => Promise<void> | void
}

const PARAM = "i"

export function parseQuery(): OptionCategory {
    const initialQuery: string | string[] | undefined = useRoute().query?.[PARAM]
    const queryVal: string | undefined = Array.isArray(initialQuery) ? initialQuery[0] : initialQuery
    if (!queryVal) return null
    const cate = queryVal as OptionCategory
    return ALL_CATEGORIES.includes(cate) ? cate : null
}

export function changeQuery(cate: OptionCategory, router: Router) {
    const query = {}
    query[PARAM] = cate
    router.replace({ query })
}