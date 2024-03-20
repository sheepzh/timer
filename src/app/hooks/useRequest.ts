import { ElLoadingService } from "element-plus"
import { Ref, onMounted, ref } from "vue"

type Option<T> = {
    manual?: boolean
    defaultValue?: T
    loadingTarget?: string | Ref<HTMLElement>
    loadingText?: string
}

type Result<T> = {
    data: Ref<T>
    refresh: () => void
    refreshAsync: () => Promise<void>
    loading: Ref<boolean>
}

export const useRequest = <T,>(getter: () => Promise<T> | T, option?: Option<T>): Result<T> => {
    const { manual = false, defaultValue, loadingTarget, loadingText } = option || {}
    const data: Ref<T> = ref(defaultValue) as Ref<T>
    const loading = ref(false)
    let loadingInstance: { close?: () => void } = null

    const refreshAsync = async () => {
        loading.value = true
        const loadingEl = typeof loadingTarget === "string" ? loadingTarget : loadingTarget?.value
        loadingEl && (loadingInstance = ElLoadingService({ target: loadingEl, text: loadingText }))
        try {
            const value = await getter?.()
            data.value = value
        } finally {
            loading.value = false
            loadingInstance?.close?.()
        }
    }
    const refresh = () => { refreshAsync() }
    if (!manual) onMounted(refresh)
    return { data, refresh, refreshAsync, loading }
}