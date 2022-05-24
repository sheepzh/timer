/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { IS_CHROME, IS_EDGE, IS_FIREFOX } from "./environment"

/**
 * @since 0.9.6
 */
export const CHROME_ID = "dkdhhcbjijekmneelocdllcldcpmekmm"

/**
 * @since 0.9.6
 */
export const FIREFOX_ID = "{a8cf72f7-09b7-4cd4-9aaa-7a023bf09916}"

/**
 * @since 0.9.6
 */
export const EDGE_ID = "fepjgblalcnepokjblgbgmapmlkgfahc"

const id = chrome.runtime.id

/**
 * @since 0.9.6
 */
export const IS_FROM_STORE = (IS_CHROME && id === CHROME_ID)
    || (IS_EDGE && id === EDGE_ID)
    || (IS_FIREFOX && id === FIREFOX_ID)