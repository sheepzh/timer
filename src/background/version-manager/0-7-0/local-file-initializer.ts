/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import MergeRuleDatabase from "@db/merge-rule-database"
import HostAliasDatabase from "@db/host-alias-database"
import { JSON_HOST, LOCAL_HOST_PATTERN, MERGED_HOST, PDF_HOST, PIC_HOST, TXT_HOST } from "@util/constant/remain-host"
import IVersionProcessor from "../i-version-processor"
import { t2Chrome } from "@util/i18n/chrome/t"

const storage: chrome.storage.StorageArea = chrome.storage.local

const mergeRuleDatabase = new MergeRuleDatabase(storage)
const hostAliasDatabase = new HostAliasDatabase(storage)

/**
 * Process the host of local files
 * 
 * @since 0.7.0
 */
export default class LocalFileInitializer implements IVersionProcessor {
    since(): string {
        return '0.7.0'
    }

    process(): void {
        // Add merged rules
        mergeRuleDatabase.add({
            origin: LOCAL_HOST_PATTERN,
            merged: MERGED_HOST,
        }).then(() => console.log('Local file merge rules initialized'))
        // Add site name
        hostAliasDatabase.update({
            host: PDF_HOST,
            name: t2Chrome(msg => msg.initial.localFile.pdf),
            source: 'DETECTED'
        })
        hostAliasDatabase.update({
            host: JSON_HOST,
            name: t2Chrome(msg => msg.initial.localFile.json),
            source: 'DETECTED'
        })
        hostAliasDatabase.update({
            host: PIC_HOST,
            name: t2Chrome(msg => msg.initial.localFile.pic),
            source: 'DETECTED'
        })
        hostAliasDatabase.update({
            host: TXT_HOST,
            name: t2Chrome(msg => msg.initial.localFile.txt),
            source: 'DETECTED'
        })
    }
}