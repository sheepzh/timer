/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import BaseDatabase from "./common/base-database"
import { META_KEY } from "./common/constant"

/**
 * @since 0.6.0
 */
class MetaDatabase extends BaseDatabase {
    async getMeta(): Promise<timer.ExtensionMeta> {
        const meta = await this.storage.getOne<timer.ExtensionMeta>(META_KEY)
        return meta || {}
    }

    async importData(data: any): Promise<void> {
        const meta: timer.ExtensionMeta = data[META_KEY] as timer.ExtensionMeta
        if (!meta) return

        const existMeta = await this.getMeta()
        const { popupCounter = {}, appCounter = {} } = existMeta
        popupCounter._total = (popupCounter._total ?? 0) + (popupCounter._total ?? 0)
        if (meta.appCounter) {
            Object.entries(meta.appCounter).forEach(([routePath, count]) => {
                appCounter[routePath] = (appCounter[routePath] ?? 0) + count
            })
        }
        await this.update({ ...existMeta, popupCounter, appCounter })
    }

    async update(existMeta: timer.ExtensionMeta): Promise<void> {
        await this.storage.put(META_KEY, existMeta)
    }
}

export default MetaDatabase