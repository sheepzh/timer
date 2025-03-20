import { useProvide, useProvider, useRequest } from "@hooks"
import cateService from "@service/cate-service"
import { type Ref } from "vue"

type AppContextValue = {
    categories: Ref<timer.site.Cate[]>
    refreshCategories: () => void
}

const NAMESPACE = '_'

export const initAppContext = () => {
    const { data: categories, refresh: refreshCategories } = useRequest(() => cateService.listAll(), { defaultValue: [] })
    useProvide<AppContextValue>(NAMESPACE, { categories, refreshCategories })
}

export const useCategories = () => useProvider<AppContextValue, "categories" | "refreshCategories">(NAMESPACE, "categories", "refreshCategories")
