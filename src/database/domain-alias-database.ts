/**
 * @author zhy
 * @since 0.4.1
 */
import { DomainAlias, DomainSource } from "../entity/dto/domain-alias"
import BaseDatabase from "./common/base-database"
import { REMAIN_WORD_PREFIX } from "./common/constant"

const DB_KEY_PREFIX = REMAIN_WORD_PREFIX + "ALIAS"
const DB_KEY_PREFIX_LENGTH = DB_KEY_PREFIX.length

const SOURCE_PREFIX_MAP: { [source in DomainSource]: string } = {
    USER: 'u',
    DETECTED: 'd'
}
const ABBR_MAP = {
    'u': DomainSource.USER,
    'd': DomainSource.DETECTED
}

const generateKey = (domain: string) => DB_KEY_PREFIX + domain
const domainOf = (key: string) => key.substring(DB_KEY_PREFIX_LENGTH)
function valueOf(domain: string, value: string): DomainAlias {
    const abbr = value.substr(0, 1)

    return {
        domain,
        source: ABBR_MAP[abbr],
        name: value.substr(1)
    }
}

class DomainAliasDatabase extends BaseDatabase {

    /**
     * Update the alias
     */
    async update(toUpdate: DomainAlias): Promise<void> {
        const { domain, name, source } = toUpdate
        const key = generateKey(domain)
        const value = SOURCE_PREFIX_MAP[source] + name
        if (source === DomainSource.USER) {
            // Force update
            return this.storage.put(key, value)
        }
        const existVal = this.storage.getOne(key)
        if (!existVal || typeof existVal !== 'string') {
            // Force update
            return this.storage.put(key, value)
        }
        const abbr = (existVal as string).substring(0, 1)
        if (ABBR_MAP[abbr] === DomainSource.DETECTED) {
            // Update
            return this.storage.put(key, value)
        }
    }

    async get(...domains: string[]): Promise<{ [host: string]: DomainAlias }> {
        const keys = domains.map(generateKey)
        const items = await this.storage.get(keys)
        const result = {}
        Object.entries(items).forEach(([key, value]) => {
            const domain = domainOf(key)
            result[domain] = valueOf(domain, value)
        })
        return Promise.resolve(result)
    }

    async importData(data: any): Promise<void> {
        const items = await this.storage.get()
        const toSave = {}
        Object.entries(data)
            .filter(([key, value]) => key.startsWith(DB_KEY_PREFIX) && !!value && typeof value === 'string')
            .forEach(([key, value]) => toSave[key] = this.migrate(items[key], value as string))
        await this.storage.set(toSave)
    }

    private migrate(exist: string | undefined, toUpdate: string): string {
        if (!exist) {
            return toUpdate
        }
        if (exist.startsWith('u') && !toUpdate.startsWith('u')) {
            return exist
        }
        return toUpdate
    }
}

export default DomainAliasDatabase