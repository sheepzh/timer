import limitService from "@service/limit-service"
import type { Migrator } from "./common"

const PROTOCOLS = ['https://', 'http://', '*://']

export default class LimitRuleMigrator implements Migrator {
    onInstall(): void {
    }

    async onUpdate(_version: string): Promise<void> {
        const rules = await limitService.select()
        if (!rules?.length) return
        rules.forEach(async rule => {
            const { cond } = rule
            let changed = false
            const newCond: string[] = []
            cond?.forEach(url => {
                for (const p of PROTOCOLS) {
                    if (url?.startsWith(p)) {
                        changed = true
                        newCond.push(url.substring(p.length))
                        return
                    }
                }
            })
            if (!changed) return
            rule.cond = newCond
            await limitService.update(rule)
        })
    }
}