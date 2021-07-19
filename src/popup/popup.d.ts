import SiteInfo, { SiteItem } from "../entity/dto/site-info"

declare type QueryResult = {
    type: SiteItem
    mergeDomain: boolean
    data: SiteInfo[]
}