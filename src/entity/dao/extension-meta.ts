/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * Meta data of this extension
 */
export type ExtensionMeta = {
    installTime?: number
    appCounter?: { [routePath: string]: number }
    popupCounter?: {
        _total?: number
    }

}