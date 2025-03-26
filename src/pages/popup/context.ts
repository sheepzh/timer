import { useRequest, useState } from "@hooks"
import { useProvide, useProvider } from "@hooks/useProvider"
import cateService from "@service/cate-service"
import optionService from "@service/option-service"
import { groupBy } from "@util/array"
import { isDarkMode, toggle } from "@util/dark-mode"
import { CATE_NOT_SET_ID } from "@util/site"
import { computed, ComputedRef, ref, type Ref } from "vue"
import { type PopupQuery } from "./common"
import { t } from "./locale"

type PopupContextValue = {
    reload: () => void
    darkMode: Ref<boolean>
    setDarkMode: (val: boolean) => void
    query: Ref<PopupQuery>
    setQuery: (val: PopupQuery) => void
    dimension: ComputedRef<timer.core.Dimension>
    cateNameMap: Ref<Record<number, string>>
}

const NAMESPACE = '_'

export const initPopupContext = (defaultQuery: PopupQuery): Ref<number> => {
    const appKey = ref(Date.now())
    const reload = () => appKey.value = Date.now()

    const { data: darkMode, refresh: refreshDarkMode } = useRequest(() => optionService.isDarkMode(), { defaultValue: isDarkMode() })

    const [query, setQuery] = useState(defaultQuery)

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

    const dimension = computed(() => query.value.type)
    useProvide<PopupContextValue>(NAMESPACE, { reload, darkMode, setDarkMode, query, setQuery, cateNameMap, dimension })

    return appKey
}

export const usePopupContext = () => useProvider<PopupContextValue, 'reload' | 'darkMode' | 'setDarkMode' | 'query' | 'setQuery' | 'cateNameMap'>(
    NAMESPACE, 'reload', 'darkMode', 'setDarkMode', 'query', 'setQuery', 'cateNameMap'
)

export const useDimension = () => useProvider<PopupContextValue, 'dimension'>(NAMESPACE, 'dimension').dimension

export const useCateNameMap = () => useProvider<PopupContextValue, 'cateNameMap'>(NAMESPACE, 'cateNameMap')?.cateNameMap