import mergeRuleDatabase from "../../../database/merge-rule-database"
import IVersionProcessor from "../i-version-processor"

/**
 * v0.1.2
 * 
 * Initialize the merge rules
 */
export default class DomainMergeInitializer implements IVersionProcessor {
    since(): string {
        return '0.1.2'
    }

    process(): void {
        mergeRuleDatabase.add(
            // Google's regional domain names 
            { origin: '*.google.com.*', merged: 'google.com' },
            // level-3 of .edu.cn
            { origin: '*.*.edu.cn', merged: 2 },
            // not merge wx2.qq.com 
            { origin: 'wx2.qq.com', merged: '' }
        ).then(() => console.log('Domain merge rules initialized'))
    }
}