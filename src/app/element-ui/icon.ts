/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import {
    DefineComponent,
    ComponentOptionsMixin as Mixin,
    EmitsOptions,
    VNodeProps,
    AllowedComponentProps,
    ComponentCustomProps
} from "vue"

type IconPublicProps = VNodeProps & AllowedComponentProps & ComponentCustomProps

type IconProps = Readonly<{} & {} & {}>

type ElementIcon = DefineComponent<{}, {}, {}, {}, {}, Mixin, Mixin, EmitsOptions, string, IconPublicProps, IconProps, {}>

/**
 * Rename for definition of el-icon
 * @since 0.4.1 
 */
export default ElementIcon