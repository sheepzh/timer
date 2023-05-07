/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { RouteRecordRaw } from "vue-router"

import { App } from "vue"
import { createRouter, createWebHashHistory } from "vue-router"
import {
    HOME_ROUTE,
    START_ROUTE,
    PRIVACY_ROUTE,
    USAGE_ROUTE,
    APP_PAGE_ROUTE,
    MERGE_ROUTE,
    VIRTUAL_ROUTE,
    LIMIT_ROUTE,
    BACKUP_ROUTE,
} from "./constants"


const routes: RouteRecordRaw[] = [{
    path: '/',
    redirect: HOME_ROUTE,
}, {
    path: HOME_ROUTE,
    component: () => import('../component/home'),
}, {
    path: START_ROUTE,
    component: () => import('../component/start'),
}, {
    path: PRIVACY_ROUTE,
    component: () => import('../component/privacy')
}, {
    path: USAGE_ROUTE,
    redirect: APP_PAGE_ROUTE,
}, {
    path: APP_PAGE_ROUTE,
    component: () => import('../component/app'),
}, {
    path: MERGE_ROUTE,
    component: () => import('../component/merge'),
}, {
    path: VIRTUAL_ROUTE,
    component: () => import('../component/virtual'),
}, {
    path: LIMIT_ROUTE,
    component: () => import('../component/limit'),
}, {
    path: BACKUP_ROUTE,
    component: () => import('../component/backup'),
}]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default (app: App) => {
    app.use(router)
}
