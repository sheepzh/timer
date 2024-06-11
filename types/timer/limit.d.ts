declare namespace timer.limit {
    /**
    * Restricted periods
    * [0, 1] means from 00:00 to 00:01
    * [0, 120] means from 00:00 to 02:00
    * @since 2.0.0
    */
    type Period = [number, number]
    /**
     * Limit rule in runtime
     *
     * @since 0.8.4
     */
    type Item = Rule & {
        /**
         * Waste today, milliseconds
         */
        waste?: number
    }
    type Rule = {
        /**
         * Id
         */
        id?: number
        /**
         * Name
         */
        name?: string
        /**
         * Condition, can be regular expression with star signs
         */
        cond: string[]
        /**
         * Time limit per day, seconds
         */
        time: number
        /**
         * Time limit per visit, seconds
         *
         * @since 2.0.0
         */
        visitTime?: number
        enabled?: boolean
        /**
         * @since 2.3.4
         */
        weekdays?: number[]
        /**
         * Allow to delay 5 minutes if time over
         */
        allowDelay?: boolean
        periods?: Period[]
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
     * @since 1.9.0
     */
    type RestrictionLevel =
        // No additional action required to lock
        | 'nothing'
        // Password required to lock or modify restricted rule
        | 'password'
        // Verification code input required to lock or modify restricted rule
        | 'verification'
        // Not allowed to unlock manually
        | 'strict'
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
