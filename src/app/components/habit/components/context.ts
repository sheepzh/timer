/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Ref } from "vue"
import { FilterOption } from "../type"
import { provideWithNs, useProviderWithNs } from "@app/util/provider"

type Context = {
    filter: Ref<FilterOption>
}

const NAMESPACE = 'habit'

export const initProvider = (filter: Ref<FilterOption>) => provideWithNs<Context>(NAMESPACE, { filter })

export const useHabitFilter = (): Ref<FilterOption> => useProviderWithNs<Context>(NAMESPACE, "filter").filter