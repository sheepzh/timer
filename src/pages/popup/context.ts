import { useProvide, useProvider } from "@hooks/useProvider"
import { type Ref } from "vue"

type PopupContextValue = {
    reload: () => void
    darkMode: Ref<boolean>
    setDarkMode: (val: boolean) => void
}

const NAMESPACE = '_'

export const initProvider = (initial: PopupContextValue) => useProvide<PopupContextValue>(NAMESPACE, initial)

export const usePopupContext = () => useProvider<PopupContextValue>(NAMESPACE, 'reload', 'darkMode', 'setDarkMode')