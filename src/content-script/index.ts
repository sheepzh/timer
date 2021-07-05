import timeService from '../service/timer-service'
import whitelistService from "../service/whitelist-service"
import processLimit from './limit'
import printInfo from "./printer"

const host = document.location.host
const url = document.location.href

async function main() {
    if (!host) return

    const isWhitelist = await whitelistService.include(host)
    if (isWhitelist) return

    timeService.addOneTime(host)
    printInfo(host)
    processLimit(url)
}

main()