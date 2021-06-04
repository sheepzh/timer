export default class DomainMergeRuleItem {
    /**
       * Origin domain, can be regular expression with star signs
       */
    origin: string
    /**
     * The merge result
     * 
     * + Empty string means equals to the origin domain
     * + Number means the count of kept dots, must be natural number (int & >=0)
     */
    merged: string | number
}