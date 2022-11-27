/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * The wrapper of filter item history
 * 
 * @param path path of route
 * @param paramName the name of param
 */
class FilterItemHistoryWrapper {
    private key: string

    constructor(path: string, paramName: string) {
        if (!path || !paramName) {
            this.key = undefined
        } else {
            this.key = `__filter_item_history_value_${path}_${paramName}`
        }
    }

    /**
     * get the value
     * 
     * @returns val of undefined
     */
    getValue(): string {
        if (!this.key) {
            return undefined
        }
        return localStorage.getItem(this.key)
    }

    /**
     * Set new value
     * 
     * @param newVal 
     */
    setValue(newVal: string) {
        newVal && this.key && localStorage.setItem(this.key, newVal)
    }

    /**
     * Do something if the value exists
     * 
     * @param callback 
     */
    ifPresent(callback: (historyVal: string) => void) {
        const val = this.getValue()
        val && callback?.(val)
    }
}

export default FilterItemHistoryWrapper