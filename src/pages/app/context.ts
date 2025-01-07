import { useProvide, useProvider, useRequest } from "@hooks"
import cateService from "@service/cate-service"
import { type Ref } from "vue"

type AppContextValue = {
    categories: Ref<timer.site.Cate[]>
    refreshCategories: () => void
}

const NAMESPACE = '_'

export const initAppContext = () => {
    const { data: categories, refresh: refreshCategories } = useRequest(() => cateService.listAll())
    useProvide<AppContextValue>(NAMESPACE, { categories, refreshCategories })
}

export const useCategories = (): Pick<AppContextValue, "categories" | "refreshCategories"> =>
    useProvider<AppContextValue>(NAMESPACE, "categories", "refreshCategories") as Pick<AppContextValue, "categories" | "refreshCategories">
