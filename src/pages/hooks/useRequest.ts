import { ElLoadingService } from "element-plus"
import { onBeforeMount, onMounted, ref, watch, type Ref, type WatchSource } from "vue"

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
    refreshAgain: () => void
    loading: Ref<boolean>
    param: Ref<P>
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
    const param = ref<P>()

    const refreshAsync = async (...p: P) => {
        loading.value = true
        const loadingEl = typeof loadingTarget === "string" ? loadingTarget : loadingTarget?.value
        const loadingInstance = loadingEl ? ElLoadingService({ target: loadingEl, text: loadingText }) : null
        try {
            param.value = p
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
    if (!manual) {
        // If loading target specified, do first query after mounted
        const hook = loadingTarget ? onMounted : onBeforeMount
        hook(() => refresh(...defaultParam))
    }
    if (deps && (!Array.isArray(deps) || deps?.length)) {
        watch(deps, () => refresh(...defaultParam))
    }
    const refreshAgain = () => param.value && refresh(...param.value)
    return { data, refresh, refreshAsync, refreshAgain, loading, param }
}

export const useManualRequest = <P extends any[], T>(getter: (...p: P) => Promise<T> | T, option?: Omit<Option<T, P>, 'manual'>): Result<T, P> => {
    return useRequest(getter, { ...option || {}, manual: true })
}