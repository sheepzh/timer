import DomainMergeRuleItem from "../../entity/dto/domain-merge-rule-item"
import { isIpAndPort } from "../../util/pattern"

/**
 * Ruler to merge domain
 */
export interface IDomainMergeRuler {
    merge(domain: string): string
}

/**
 * @param domain domain
 * @param dotCount the count of dots to remain 
 */
const getTheSuffix = (origin: string, dotCount: number) => {
    if (isIpAndPort(origin)) return origin

    let result = []
    while (true) {
        if (dotCount-- < 0) {
            break
        }
        if (!origin.includes('.')) {
            result.push(origin)
            break
        }

        const index = origin.lastIndexOf('.')
        result.push(origin.substr(index + 1))
        origin = origin.substring(0, index)
    }
    return result.reverse().join('.')
}

type RegRuleItem = {
    reg: RegExp
    result: string | number
}

export default class CustomizedDOmainMergeRuler implements IDomainMergeRuler {
    private noRegMergeRules: { [origin: string]: string | number } = {}

    private regs: RegRuleItem[] = []

    constructor(rules: DomainMergeRuleItem[]) {
        for (const { origin, merged } of rules) {
            if (origin.includes('*')) {
                const regStr = origin
                    // replaceAll('.', '\\.')
                    .split('.').join('\\.')
                    // replaceAll('*', '.*')
                    .split('*').join('[^\\.]+')
                const reg = new RegExp('^' + regStr + '$')
                this.regs.push({ reg, result: merged })
            } else {
                this.noRegMergeRules[origin] = merged
            }
        }
    }

    /**
     * @param domain origin domain host
     * @returns merged domain host
     */
    merge(origin: string): string {
        // First check the static rules
        let merged = this.noRegMergeRules[origin]
        // The check the regular rules
        if (merged === undefined) {
            for (const item of this.regs) {
                if (item.reg.test(origin)) {
                    merged = item.result
                    break
                }
            }
        }
        return this.merge0(merged === undefined ? 1 : merged, origin)
    }

    private merge0(merged: string | number, origin: string): string {
        if (typeof merged === 'string') {
            return merged === '' ? origin : merged
        } else {
            return getTheSuffix(origin, merged)
        }
    }
}