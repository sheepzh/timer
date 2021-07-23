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


const processRegStr = (regStr: string) => regStr.split('.').join('\\.').split('*').join('[^\\.]+')

const convert = (dbItem: DomainMergeRuleItem) => {
    const { origin, merged } = dbItem
    if (origin.includes('*')) {
        const regStr = processRegStr(origin)
        const reg = new RegExp('^' + regStr + '$')
        return { reg, result: merged } as RegRuleItem
    } else {
        return [origin, merged]
    }
}

export default class CustomizedDomainMergeRuler implements IDomainMergeRuler {
    private noRegMergeRules: { [origin: string]: string | number } = {}

    private regulars: RegRuleItem[] = []

    constructor(rules: DomainMergeRuleItem[]) {
        rules.map(item => convert(item))
            .forEach(rule => Array.isArray(rule) ? (this.noRegMergeRules[rule[0]] = rule[1]) : (this.regulars.push(rule)))
    }

    /**
     * @param domain origin domain host
     * @returns merged domain host
     */
    merge(origin: string): string {
        // First check the static rules
        let merged = this.noRegMergeRules[origin]
        // The check the regular rules
        let matchResult: undefined | RegRuleItem = undefined
        merged === undefined && (matchResult = this.regulars.find(item => item.reg.test(origin)))
        matchResult && (merged = matchResult.result)
        return this.merge0(merged === undefined ? 1 : merged, origin)
    }

    private merge0(merged: string | number, origin: string): string {
        return typeof merged === 'string' ? (merged === '' ? origin : merged) : getTheSuffix(origin, merged)
    }
}