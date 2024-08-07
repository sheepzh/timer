/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Ref } from "vue"
import { useProvide, useProvider } from "@hooks"
import { FilterOption } from "./HabitFilter"

type Context = {
    filter: Ref<FilterOption>
}

const NAMESPACE = 'habit'

export const initProvider = (filter: Ref<FilterOption>) => useProvide<Context>(NAMESPACE, { filter })

export const useHabitFilter = (): Ref<FilterOption> => useProvider<Context>(NAMESPACE, "filter").filter