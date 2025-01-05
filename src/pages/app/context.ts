import { useProvide, useProvider } from "@hooks"
import { Ref } from "vue"

type AppContextValue = {
    categories: Ref<timer.site.Cate[]>
    refreshCategories: () => void
}

const NAMESPACE = '_'

export const initProvider = (initial: AppContextValue) => useProvide<AppContextValue>(NAMESPACE, initial)

export const useCategories = (): Pick<AppContextValue, "categories" | "refreshCategories"> =>
    useProvider<AppContextValue>(NAMESPACE, "categories", "refreshCategories") as Pick<AppContextValue, "categories" | "refreshCategories">
