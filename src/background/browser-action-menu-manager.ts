/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { OPTION_ROUTE } from "../app/router/constants"
import { getAppPageUrl, getGuidePageUrl, SOURCE_CODE_PAGE, TU_CAO_PAGE } from "@util/constant/url"
import { t2Chrome } from "@i18n/chrome/t"
import { IS_SAFARI } from "@util/constant/environment"
import { createTab } from "@api/chrome/tab"
import { getRuntimeId } from "@api/chrome/runtime"
import { createContextMenu } from "@api/chrome/context-menu"

const APP_PAGE_URL = getAppPageUrl(true)

const baseProps: Partial<chrome.contextMenus.CreateProperties> = {
    contexts: ['action'],
    visible: true
}

function titleOf(prefixEmoji: string, title: string) {
    if (IS_SAFARI) {
        // Emoji does not work in Safari's context menu
        return title
    } else {
        return `${prefixEmoji} ${title}`
    }
}

const allFunctionProps: ChromeContextMenuCreateProps = {
    id: getRuntimeId() + '_timer_menu_item_app_link',
    title: titleOf('🏷️', t2Chrome(msg => msg.base.allFunction)),
    onclick: () => createTab(APP_PAGE_URL),
    ...baseProps
}

const optionPageProps: ChromeContextMenuCreateProps = {
    id: getRuntimeId() + '_timer_menu_item_option_link',
    title: titleOf('🥰', t2Chrome(msg => msg.contextMenus.optionPage)),
    onclick: () => createTab(APP_PAGE_URL + '#' + OPTION_ROUTE),
    ...baseProps
}

const repoPageProps: ChromeContextMenuCreateProps = {
    id: getRuntimeId() + '_timer_menu_item_repo_link',
    title: titleOf('🍻', t2Chrome(msg => msg.contextMenus.repoPage)),
    onclick: () => createTab(SOURCE_CODE_PAGE),
    ...baseProps
}

const feedbackPageProps: ChromeContextMenuCreateProps = {
    id: getRuntimeId() + '_timer_menu_item_feedback_link',
    title: titleOf('😿', t2Chrome(msg => msg.contextMenus.feedbackPage)),
    onclick: () => createTab(TU_CAO_PAGE),
    ...baseProps
}

const guidePageProps: ChromeContextMenuCreateProps = {
    id: getRuntimeId() + '_timer_menu_item_guide_link',
    title: titleOf('📖', t2Chrome(msg => msg.base.guidePage)),
    onclick: () => createTab(getGuidePageUrl(true)),
    ...baseProps
}

function init() {
    createContextMenu(allFunctionProps)
    createContextMenu(optionPageProps)
    createContextMenu(repoPageProps)
    createContextMenu(feedbackPageProps)
    createContextMenu(guidePageProps)
}

export default init
