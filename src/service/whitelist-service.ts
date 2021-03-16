import timerDatabase from "../database/timer-database"
import whitelistDatabase from "../database/whitelist-database"

/**
 * Service of whitelist
 * 
 * @since 0.0.5
 */
class WhitelistService {

    public add(url: string, callback?: () => void) {
        whitelistDatabase.add(url, () => {
            timerDatabase.deleteByUrl(url, callback)
        })
    }

    public listAll(callback: (whitelist: string[]) => void) {
        whitelistDatabase.selectAll(callback)
    }

    public remove(url: string, callback?: () => void) {
        whitelistDatabase.remove(url, callback)
    }

    /**
     * @since 0.0.7
     */
    public include(url: string, callback?: (including: boolean) => void) {
        whitelistDatabase.includes(url, callback)
    }
}

export default new WhitelistService()