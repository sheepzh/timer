/**
 * @since 0.2.2
 */
class DomainOptionInfo {
    host: string
    merged: boolean

    constructor(host: string, merged?: boolean) {
        this.host = host || ''
        this.merged = merged || false
    }

    static empty = () => DomainOptionInfo.origin('')

    static origin(host: string) {
        return new DomainOptionInfo(host)
    }

    static merged(host: string) {
        return new DomainOptionInfo(host, true)
    }

    static from(key: string) {
        if (!key || !key.length) return this.empty()
        const merged = key.charAt(0) === '1'
        return new DomainOptionInfo(key.substr(1), merged)
    }

    key(): string {
        return (this.merged ? "1" : '0') + (this.host || '')
    }
}

export default DomainOptionInfo
