/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export default class UrlPathItem {
    origin: string
    ignored: boolean

    static of(origin: string, ignored?: boolean) {
        const item: UrlPathItem = new UrlPathItem()
        item.origin = origin
        item.ignored = !!ignored
        return item
    }

    toString(): string {
        return this.ignored ? "*" : (this.origin || '')
    }
}