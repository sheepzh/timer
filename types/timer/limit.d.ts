declare namespace timer.limit {
    /**
     * Limit rule in runtime
     * 
     * @since 0.8.4
     */
    type Item = Rule & {
        regular: RegExp
        /**
         * Waste today, milliseconds
         */
        waste?: number
    }
    type Rule = {
        /**
         * Condition, can be regular expression with star signs
         */
        cond: string
        /**
         * Time limit, seconds
         */
        time: number
        enabled: boolean
        /**
         * Allow to delay 5 minutes if time over
         */
        allowDelay: boolean
    }
    type Record = Rule & {
        /**
         * The latest record date
         */
        latestDate: string
        /**
         * Time wasted in the latest record date
         */
        wasteTime: number
    }
    /**
     * @since 1.3.2
     */
    type FilterType =
        // translucent filter
        | 'translucent'
        // ground glass filter
        | 'groundGlass'
    /**
     * @since 1.9.0
     */
    type RestrictionLevel =
        // No additional action required to lock
        | 'nothing'
        // Password required to lock or modify restricted rule
        | 'password'
        // Verification code input requird to lock or modify restricted rule
        | 'verification'
    /**
     * @since 1.9.0
     */
    type VerificationDifficulty =
        // Easy
        | 'easy'
        // Need some operations
        | 'hard'
        // Disgusting
        | 'disgusting'
}
