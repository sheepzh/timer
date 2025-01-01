/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { onMounted, ref, type Ref, watch } from "vue"

type Result<T> = {
    data: Ref<T>
    setter: (val: T) => void
}

const getInitialValue = <T>(key: string, defaultValue?: T): T => {
    if (!key) return defaultValue
    const exist = localStorage.getItem(key)
    if (!exist) return defaultValue
    try {
        return JSON.parse(exist) as T
    } catch (e) {
        return null
    }
}

const saveCache = <T>(key: string, val: T) => {
    if (!key) return
    if (val === null || val === undefined || val === '') {
        localStorage.removeItem(key)
    } else {
        localStorage.setItem(key, JSON.stringify(val))
    }
}

export const useCached = <T>(key: string, defaultValue?: T): Result<T> => {
    const data: Ref<T> = ref<T>()
    const setter = (val: T) => data.value = val
    onMounted(() => setter(getInitialValue(key, defaultValue)))
    watch(data, () => saveCache(key, data.value))
    return { data, setter }
}
