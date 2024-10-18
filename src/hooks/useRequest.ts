import { ElLoadingService } from "element-plus"
import { Ref, WatchSource, onMounted, ref, watch } from "vue"

type Option<T, P extends any[]> = {
    manual?: boolean
    defaultValue?: T
    loadingTarget?: string | Ref<HTMLElement>
    loadingText?: string
    defaultParam?: P
    deps?: WatchSource<unknown> | WatchSource<unknown>[]
    onSuccess?: (result: T) => void,
    onError?: (e: unknown) => void
}

type Result<T, P extends any[]> = {
    data: Ref<T>
    refresh: (...p: P) => void
    refreshAsync: (...p: P) => Promise<void>
    loading: Ref<boolean>
}

export const useRequest = <P extends any[], T>(getter: (...p: P) => Promise<T> | T, option?: Option<T, P>): Result<T, P> => {
    const {
        manual = false,
        defaultValue, defaultParam = ([] as P),
        loadingTarget, loadingText,
        deps,
        onSuccess, onError,
    } = option || {}
    const data: Ref<T> = ref(defaultValue) as Ref<T>
    const loading = ref(false)

    const refreshAsync = async (...p: P) => {
        loading.value = true
        const loadingEl = typeof loadingTarget === "string" ? loadingTarget : loadingTarget?.value
        const loadingInstance = loadingEl ? ElLoadingService({ target: loadingEl, text: loadingText }) : null
        try {
            const value = await getter?.(...p)
            data.value = value
            onSuccess?.(value)
        } catch (e) {
            onError?.(e)
        } finally {
            loading.value = false
            loadingInstance?.close?.()
        }
    }
    const refresh = (...p: P) => { refreshAsync(...p) }
    if (!manual) onMounted(() => refresh(...defaultParam))
    if (deps && (!Array.isArray(deps) || deps?.length)) {
        watch(deps, () => refresh(...defaultParam))
    }
    return { data, refresh, refreshAsync, loading }
}