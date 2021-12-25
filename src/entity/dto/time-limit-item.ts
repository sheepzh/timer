/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export default class TimeLimitItem {
    /**
     * Condition, can be regular expression with star signs
     */
    cond: string
    regular: RegExp
    /**
     * Time limit, seconds
     */
    time: number
    enabled: boolean
    allowDelay: boolean
    /**
     * Waste today, milliseconds
     */
    waste?: number

    static builder(): _Builder {
        return new _Builder
    }

    matches(url: string) {
        return this.regular.test(url)
    }

    hasLimited() {
        return this.waste >= this.time * 1000
    }
}

/**
 * Inner builder
 */
class _Builder {
    private _cond: string
    private _time: number
    private _enabled: boolean
    private _allowDelay: boolean
    private _waste?: number

    cond(newVal: string): _Builder {
        this._cond = newVal
        return this
    }

    time(newVal: number): _Builder {
        this._time = newVal
        return this
    }

    enabled(newVal: boolean): _Builder {
        this._enabled = newVal
        return this
    }

    allowDelay(newVal: boolean): _Builder {
        this._allowDelay = newVal
        return this
    }

    waste(newVal: number): _Builder {
        this._waste = newVal
        return this
    }

    build(): TimeLimitItem {
        const result = new TimeLimitItem()
        result.cond = this._cond
        result.regular = new RegExp(`^${this._cond.split('*').join('.*')}`)
        result.time = this._time
        result.enabled = this._enabled === undefined ? true : this._enabled
        result.allowDelay = this._allowDelay === undefined ? true : this._allowDelay
        result.waste = this._waste || 0
        return result
    }
}