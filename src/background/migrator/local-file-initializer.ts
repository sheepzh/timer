/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import MergeRuleDatabase from "@db/merge-rule-database"
import { JSON_HOST, LOCAL_HOST_PATTERN, MERGED_HOST, PDF_HOST, PIC_HOST, TXT_HOST } from "@util/constant/remain-host"
import { t2Chrome } from "@i18n/chrome/t"
import siteService from "@service/site-service"
import { type Migrator } from "./common"

const mergeRuleDatabase = new MergeRuleDatabase(chrome.storage.local)

/**
 * Process the host of local files
 *
 * @since 0.7.0
 */
export default class LocalFileInitializer implements Migrator {
    onUpdate(_version: string): void {
    }

    onInstall(): void {
        // Add merged rules
        mergeRuleDatabase.add({
            origin: LOCAL_HOST_PATTERN,
            merged: MERGED_HOST,
        }).then(() => console.log('Local file merge rules initialized'))
        // Add site name
        siteService.saveAlias(
            { host: PDF_HOST, type: 'normal' },
            t2Chrome(msg => msg.initial.localFile.pdf),
            'DETECTED'
        )
        siteService.saveAlias(
            { host: JSON_HOST, type: 'normal' },
            t2Chrome(msg => msg.initial.localFile.json),
            'DETECTED'
        )
        siteService.saveAlias(
            { host: PIC_HOST, type: 'normal' },
            t2Chrome(msg => msg.initial.localFile.pic),
            'DETECTED'
        )
        siteService.saveAlias(
            { host: TXT_HOST, type: 'normal' },
            t2Chrome(msg => msg.initial.localFile.txt),
            'DETECTED'
        )
    }
}