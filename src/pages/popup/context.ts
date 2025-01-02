import { useProvide, useProvider } from "@hooks/useProvider"
import { type Ref } from "vue"
import { type PopupQuery } from "./common"


type PopupContextValue = {
    reload: () => void
    darkMode: Ref<boolean>
    setDarkMode: (val: boolean) => void
    query: Ref<PopupQuery>
    setQuery: (val: PopupQuery) => void
}

const NAMESPACE = '_'

export const initProvider = (initial: PopupContextValue) => useProvide<PopupContextValue>(NAMESPACE, initial)

export const usePopupContext = () => useProvider<PopupContextValue>(
    NAMESPACE, 'reload', 'darkMode', 'setDarkMode', 'query', 'setQuery'
)