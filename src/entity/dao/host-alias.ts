/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * @since 0.4.1
 * @author zhy
 */
export enum HostAliasSource {
    USER = 'USER',        // By user
    DETECTED = 'DETECTED' // Auto-detected
}

type HostAlias = {
    host: string
    name: string
    source: HostAliasSource
}

export default HostAlias