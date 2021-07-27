import SiteInfo from "../entity/dto/site-info"

declare type QueryResult = {
    type: Timer.SiteItem
    mergeDomain: boolean
    data: SiteInfo[]
}