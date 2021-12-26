/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"

/**
 * @since 0.2.2
 */
class HostOptionInfo {
    host: string
    merged: boolean

    constructor(host: string, merged?: boolean) {
        this.host = host || ''
        this.merged = merged || false
    }

    static empty = () => HostOptionInfo.origin('')

    static origin(host: string) {
        return new HostOptionInfo(host)
    }

    static merged(host: string) {
        return new HostOptionInfo(host, true)
    }

    static from(key: string) {
        if (!key || !key.length) return this.empty()
        const merged = key.charAt(0) === '1'
        return new HostOptionInfo(key.substr(1), merged)
    }

    key(): string {
        return (this.merged ? "1" : '0') + (this.host || '')
    }

    toString(): string {
        const { host, merged } = this
        if (!host) return ''
        const mergedLabel = merged ? `[${t(msg => msg.trend.merged)}]` : ''
        return `${host}${mergedLabel}`
    }
}

export default HostOptionInfo
