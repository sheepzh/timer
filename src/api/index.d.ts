/**
 * @since 0.1.8
 */
declare interface FirefoxDetail {
    current_version: {
        // Like 0.1.5
        version: string
    }
    // Like '2021-06-11T08:45:32Z'
    last_updated: string
}

/**
 * @since 0.1.8
 */
declare interface EdgeDetail {
    // Version like 0.1.5, without 'v' prefix
    version: string
    // Like '1619432502.5944779'
    lastUpdateDate: string
}