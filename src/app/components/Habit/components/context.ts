/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useProvide, useProvider } from "@hooks"
import { type Ref } from "vue"
import { type FilterOption } from "./HabitFilter"

type Context = {
    filter: Ref<FilterOption>
}

const NAMESPACE = 'habit'

export const initProvider = (filter: Ref<FilterOption>) => useProvide<Context>(NAMESPACE, { filter })

export const useHabitFilter = (): Ref<FilterOption> => useProvider<Context>(NAMESPACE, "filter").filter