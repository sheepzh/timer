/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { OPTION_ROUTE } from "../app/router/constants"
import { getAppPageUrl, SOURCE_CODE_PAGE, TU_CAO_PAGE } from "@util/constant/url"
import { t2Chrome } from "@util/i18n/chrome/t"

const APP_PAGE_URL = getAppPageUrl(true)

const baseProps: Partial<chrome.contextMenus.CreateProperties> = {
    contexts: ['action'],
    visible: true
}

const allFunctionProps: chrome.contextMenus.CreateProperties = {
    id: '_timer_menu_item_app_link_',
    title: '🏷️ ' + t2Chrome(msg => msg.contextMenus.allFunctions),
    onclick: () => chrome.tabs.create({ url: APP_PAGE_URL }),
    ...baseProps
}

const optionPageProps: chrome.contextMenus.CreateProperties = {
    id: '_timer_menu_item_option_link_',
    title: '🥰 ' + t2Chrome(msg => msg.contextMenus.optionPage),
    onclick: () => chrome.tabs.create({ url: APP_PAGE_URL + '#' + OPTION_ROUTE }),
    ...baseProps
}

const repoPageProps: chrome.contextMenus.CreateProperties = {
    id: '_timer_menu_item_repo_link',
    title: '🍻 ' + t2Chrome(msg => msg.contextMenus.repoPage),
    onclick: () => chrome.tabs.create({ url: SOURCE_CODE_PAGE }),
    ...baseProps
}

const feedbackPageProps: chrome.contextMenus.CreateProperties = {
    id: '_timer_menu_item_feedback_link',
    title: '😿 ' + t2Chrome(msg => msg.contextMenus.feedbackPage),
    onclick: () => chrome.tabs.create({ url: TU_CAO_PAGE }),
    ...baseProps
}

function init() {
    const allProps = [
        allFunctionProps,
        optionPageProps,
        repoPageProps,
        feedbackPageProps,
    ]
    const handleClick = {}

    allProps.forEach(props => {
        handleClick[props.id] = props.onclick
        // Not set onclick for MV3
        delete props.onclick
        chrome.contextMenus.create(props)
    })

    chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData) => {
        const { menuItemId } = info
        handleClick[menuItemId]?.()
    })
}

export default init