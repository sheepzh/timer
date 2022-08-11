/**
 * Data format in each json file in gist
 */
declare type GistData = {
    /**
     * Index = month_of_part * 32 + date_of_month
     */
    [index: string]: GistRow
}

/**
 * Row stored in the gist
 */
declare type GistRow = {
    [host: string]: [
        number,     // Visit count
        number,     // Browsing time
        number      // Running time
    ]
}