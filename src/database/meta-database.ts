/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ExtensionMeta } from "@entity/dao/extension-meta"
import BaseDatabase from "./common/base-database"
import { META_KEY } from "./common/constant"

/**
 * @since 0.6.0
 */
class MetaDatabase extends BaseDatabase {
    async getMeta(): Promise<ExtensionMeta> {
        const meta = (await this.storage.getOne(META_KEY)) as ExtensionMeta
        if (!meta) {
            return {}
        } else {
            return meta
        }
    }

    async importData(data: any): Promise<void> {
        const meta: ExtensionMeta = data[META_KEY] as ExtensionMeta
        if (!meta) {
            return
        }
        const existMeta = await this.getMeta()
        if (!existMeta.popupCounter) {
            existMeta.popupCounter = {}
        }
        existMeta.popupCounter._total = (existMeta.popupCounter._total || 0) + (meta.popupCounter._total || 0)
        if (!existMeta.appCounter) {
            existMeta.appCounter = {}
        }
        const existAppCounter = existMeta.appCounter
        if (meta.appCounter) {
            Object.entries(meta.appCounter).forEach(([routePath, count]) => {
                existAppCounter[routePath] = (existAppCounter[routePath] || 0) + count
            })
        }
        existMeta.appCounter = existAppCounter
        await this.update(existMeta)
    }

    async update(existMeta: ExtensionMeta): Promise<void> {
        await this.storage.put(META_KEY, existMeta)
    }
}

export default MetaDatabase