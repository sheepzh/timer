/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import BaseDatabase from "./common/base-database"
import { REMAIN_WORD_PREFIX } from "./common/constant"

const KEY = REMAIN_WORD_PREFIX + "app_router"
class RouterDatabase extends BaseDatabase {
    async getHistory(): Promise<string | undefined> {
        const items = await this.storage.get(KEY)
        return items[KEY]
    }

    update(newRoute: string): Promise<void> {
        return this.setByKey(KEY, newRoute)
    }

    async importData(_data: any): Promise<void> {
        // Do nothing
    }
}

export default RouterDatabase