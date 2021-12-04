/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import SiteInfo from "../entity/dto/site-info"

declare type QueryResult = {
    type: Timer.SiteItem
    mergeDomain: boolean
    data: SiteInfo[]
}