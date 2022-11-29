/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import IVersionProcessor from "./i-version-processor"
import HostMergeInitializer from "./0-1-2/host-merge-initializer"
import LocalFileInitializer from "./0-7-0/local-file-initializer"

/**
 * Version manager
 *  
 * @since 0.1.2
 */
class VersionManager {
    processorChain: IVersionProcessor[] = []

    constructor() {
        this.processorChain.push(
            new HostMergeInitializer(),
            new LocalFileInitializer(),
        )
        this.processorChain = this.processorChain.sort((a, b) => a.since() >= b.since() ? 1 : 0)
    }

    private onChromeInstalled(reason: chrome.runtime.OnInstalledReason) {
        const version: string = chrome.runtime.getManifest().version
        if (reason === 'update') {
            // Update, process the latest version, which equals to current version
            this.processorChain
                .filter(processor => processor.since() === version)
                .forEach(processor => processor.process(reason))
        } else if (reason === 'install') {
            // All 
            this.processorChain.forEach(processor => processor.process(reason))
        }
    }

    init() {
        chrome.runtime.onInstalled.addListener(detail => this.onChromeInstalled(detail.reason))
    }
}

export default VersionManager