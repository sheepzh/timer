/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export default class HostMergeRuleItem {
    /**
       * Origin host, can be regular expression with star signs
       */
    origin: string
    /**
     * The merge result
     * 
     * + Empty string means equals to the origin host
     * + Number means the count of kept dots, must be natural number (int & >=0)
     */
    merged: string | number

    /**
     * @since 0.1.9
     */
    static of(origin: string, merged?: string | number): HostMergeRuleItem {
        if (merged === undefined) {
            merged = ''
        }
        return { origin, merged }
    }
}