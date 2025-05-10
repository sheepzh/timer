import { useLocalStorage, useRequest } from "@hooks"
import { useProvide, useProvider } from "@hooks/useProvider"
import cateService from "@service/cate-service"
import optionService from "@service/option-service"
import { groupBy } from "@util/array"
import { isDarkMode, toggle } from "@util/dark-mode"
import { CATE_NOT_SET_ID } from "@util/site"
import { computed, type ComputedRef, reactive, type Reactive, ref, type Ref, toRaw, watch } from "vue"
import { t } from "./locale"

export type PopupQuery = {
    mergeMethod: timer.stat.MergeMethod | undefined
    duration: timer.option.PopupDuration
    durationNum?: number
    dimension: timer.core.Dimension
}

type PopupContextValue = {
    reload: () => void
    darkMode: Ref<boolean>
    setDarkMode: (val: boolean) => void
    query: Reactive<PopupQuery>
    dimension: ComputedRef<timer.core.Dimension>
    cateNameMap: Ref<Record<number, string>>
}

const NAMESPACE = '_'

export const initPopupContext = (): Ref<number> => {
    const appKey = ref(Date.now())
    const reload = () => appKey.value = Date.now()

    const { data: darkMode, refresh: refreshDarkMode } = useRequest(() => optionService.isDarkMode(), { defaultValue: isDarkMode() })

    const [queryCache, setQueryCache] = useLocalStorage<PopupQuery>('popup-query', {
        dimension: 'focus',
        duration: 'today',
        mergeMethod: undefined,
    })

    const query = reactive(queryCache)
    watch(query, () => setQueryCache(toRaw(query)), { deep: true })

    const setDarkMode = async (val: boolean) => {
        const option: timer.option.DarkMode = val ? 'on' : 'off'
        await optionService.setDarkMode(option)
        toggle(val)
        refreshDarkMode()
    }

    const { data: cateNameMap } = useRequest(async () => {
        const categories = await cateService.listAll()
        const result = groupBy(categories || [], c => c?.id, l => l?.[0]?.name)
        result[CATE_NOT_SET_ID] = t(msg => msg.shared.cate.notSet)
        return result
    }, { defaultValue: {} })

    const dimension = computed(() => query.dimension)
    useProvide<PopupContextValue>(NAMESPACE, { reload, darkMode, setDarkMode, query, cateNameMap, dimension })

    return appKey
}

export const usePopupContext = () => useProvider<PopupContextValue, 'reload' | 'darkMode' | 'setDarkMode' | 'query' | 'cateNameMap'>(
    NAMESPACE, 'reload', 'darkMode', 'setDarkMode', 'query', 'cateNameMap'
)

export const useDimension = () => useProvider<PopupContextValue, 'dimension'>(NAMESPACE, 'dimension').dimension

export const useCateNameMap = () => useProvider<PopupContextValue, 'cateNameMap'>(NAMESPACE, 'cateNameMap')?.cateNameMap