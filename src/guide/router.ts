/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { App } from "vue"
import type { RouteRecordRaw } from "vue-router"

import { createRouter, createWebHashHistory } from "vue-router"

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/home'
    }, {
        path: '/home',
        component: () => import('./components/home')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default (app: App) => {
    app.use(router)
}
