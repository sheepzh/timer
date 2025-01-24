import { useProvide, useProvider } from "@hooks/useProvider"
import { useRequest } from "@hooks/useRequest"
import { useState } from "@hooks/useState"
import cateService from "@service/cate-service"
import optionHolder from "@service/components/option-holder"
import optionService from "@service/option-service"
import { groupBy } from "@util/array"
import { IS_FIREFOX } from "@util/constant/environment"
import { isDarkMode, toggle } from "@util/dark-mode"
import { CATE_NOT_SET_ID } from "@util/site"
import { onBeforeMount, ref, type Ref } from "vue"
import { type PopupQuery } from "./common"
import { t } from "./locale"

type PopupContextValue = {
    reload: () => void
    darkMode: Ref<boolean>
    setDarkMode: (val: boolean) => void
    query: Ref<PopupQuery>
    setQuery: (val: PopupQuery) => void
    cateNameMap: Ref<Record<number, string>>
}

const NAMESPACE = '_'

export const initPopupContext = (): Ref<number> => {
    const appKey = ref(Date.now())
    const reload = () => {
        if (IS_FIREFOX) {
            // Option change event triggered very late in Firefox, so reload the page directly
            location.reload()
        } else {
            appKey.value = Date.now()
        }
    }

    const { data: darkMode, refresh: refreshDarkMode } = useRequest(() => optionService.isDarkMode(), { defaultValue: isDarkMode() })

    const [query, setQuery] = useState<PopupQuery>()

    onBeforeMount(async () => {
        const option = await optionHolder.get()
        const { defaultDuration, defaultType, defaultDurationNum, defaultMergeMethod } = option || {}
        setQuery({
            mergeMethod: defaultMergeMethod,
            type: defaultType,
            duration: defaultDuration,
            durationNum: defaultDurationNum,
        })
    })

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
    })
    useProvide<PopupContextValue>(NAMESPACE, { reload, darkMode, setDarkMode, query, setQuery, cateNameMap })

    return appKey
}

export const usePopupContext = () => useProvider<PopupContextValue>(
    NAMESPACE, 'reload', 'darkMode', 'setDarkMode', 'query', 'setQuery', 'cateNameMap'
)

export const useCateNameMap = () => useProvider<PopupContextValue>(NAMESPACE, 'cateNameMap')?.cateNameMap