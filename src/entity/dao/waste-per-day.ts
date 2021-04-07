/**
 * Time waste per day. Reconstructed at v0.0.9
 * 
 * @since 0.0.1
 */
export default class WastePerDay {
    /**
     * Duration of visit
     */
    total: number
    /**
     * Duration of focus
     */
    focus: number
    /**
     * Visit times
     */
    time: number

    constructor() {
        this.total = 0
        this.focus = 0
        this.time = 0
    }
}