/**
 * @since 0.4.1
 * @author zhy
 */
export enum DomainSource {
    USER = 'USER',        // By user
    DETECTED = 'DETECTED' // Auto-detected
}

export type DomainAlias = {
    domain: string
    name: string
    source: DomainSource
}