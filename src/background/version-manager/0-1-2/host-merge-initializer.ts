/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import MergeRuleDatabase from "@db/merge-rule-database"

const mergeRuleDatabase = new MergeRuleDatabase(chrome.storage.local)

/**
 * v0.1.2
 *
 * Initialize the merge rules
 */
export default class HostMergeInitializer implements VersionProcessor {

    since(): string {
        return '0.1.2'
    }

    process(): void {
        mergeRuleDatabase.add(
            // Google's regional hosts
            { origin: '*.google.com.*', merged: 'google.com' },
            // level-3 of .edu.cn
            { origin: '*.*.edu.cn', merged: 2 },
            // not merge wx2.qq.com
            { origin: 'wx2.qq.com', merged: '' },
        ).then(() => console.log('Host merge rules initialized'))
    }
}