/**
 * Processor for version
 *  
 * @since 0.1.2
 */
export default interface IVersionProcessor {
    /**
     * The version number of this processor
     */
    since(): string

    /**
     * Initialize
     * 
     * @param reason reason of chrome OnInstalled event
     */
    process(reason: string): void
}