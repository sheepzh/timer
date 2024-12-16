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
     * Name
     */
    n: string
    /**
     * Color
     */
    c?: string
}

type Items = Record<number, Item>

function migrate(exist: Items, toMigrate: any) {
    let idBase = Object.keys(exist).map(parseInt).sort().reverse()?.[0] ?? 0 + 1
    const existLabels = new Set(Object.values(exist).map(e => e.n))

    Object.values(toMigrate).forEach(value => {
        const { n, c } = (value as Item) || {}
        if (!n || existLabels.has(n)) return

        const id = idBase
        idBase++;
        exist[id] = { n, c }
    })
}

/**
 * Site tag
 *
 * @since 2.6.0
 */
class SiteCateDatabase extends BaseDatabase {
    private async getItems(): Promise<Items> {
        return await this.storage.getOne<Items>(KEY) || {}
    }

    private async saveItems(items: Items): Promise<void> {
        await this.storage.put(KEY, items || {})
    }

    async listAll(): Promise<timer.site.Cate[]> {
        const items = await this.getItems()
        return Object.entries(items).map(([id, { n, c } = {}]) => {
            return {
                id: parseInt(id),
                name: n,
                color: c,
            } satisfies timer.site.Cate
        })
    }

    async add(cate: Pick<timer.site.Cate, "name" | "color">): Promise<timer.site.Cate> {
        const { name, color } = cate || {}
        if (!name) return

        const items = await this.getItems()
        const id = (Object.keys(items || {}).map(parseInt).sort().reverse()?.[0] ?? 0) + 1
        items[id] = { n: cate.name, c: color }

        await this.saveItems(items)
        return { name, color, id }
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