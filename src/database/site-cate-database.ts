/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import BaseDatabase from "./common/base-database"
import { REMAIN_WORD_PREFIX } from "./common/constant"

const KEY = REMAIN_WORD_PREFIX + 'TAG'

type Item = {
    /**
     * Label
     */
    l: string
    /**
     * Color
     */
    c?: string
}

type Items = Record<number, Item>

function migrate(exist: Items, toMigrate: any) {
    let idBase = Object.keys(exist).map(parseInt).sort().reverse()?.[0] ?? 0 + 1
    const existLabels = new Set(Object.values(exist).map(e => e.l))

    Object.values(toMigrate).forEach(value => {
        const { l, c } = (value as Item) || {}
        if (!l || existLabels.has(l)) return

        const id = idBase
        idBase++;
        exist[id] = { l, c }
    })
}

/**
 * Site tag
 *
 * @since 2.6.0
 */
class SiteCateDatabase extends BaseDatabase {
    async listAll(): Promise<timer.site.Cate[]> {
        const items = await this.getItems()
        return Object.entries(items).map(([id, { l, c } = {}]) => {
            return {
                id: parseInt(id),
                label: l,
                color: c,
            } satisfies timer.site.Cate
        })
    }

    private async getItems(): Promise<Items> {
        return await this.storage.getOne<Items>(KEY) || {}
    }

    async importData(data: any): Promise<void> {
        let toImport = data[KEY] as Items
        // Not import
        if (typeof toImport !== 'object') return
        const exists: Items = await this.getItems()
        migrate(exists, toImport)
        this.setByKey(KEY, exists)
    }
}

export default SiteCateDatabase