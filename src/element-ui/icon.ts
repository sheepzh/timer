/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type {
    DefineComponent,
    ComponentOptionsMixin,
    MethodOptions,
    ComputedOptions,
    ExtractPropTypes,
    VNodeProps,
    AllowedComponentProps,
    ComponentCustomProps
} from "vue"

type ElementIcon = DefineComponent<{}, {}, {}, ComputedOptions, MethodOptions, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<ExtractPropTypes<{}>>, {}>

/**
 * Rename for definition of el-icon
 * @since 0.5.0 
 */
export default ElementIcon