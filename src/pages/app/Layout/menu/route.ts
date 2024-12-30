import { createTabAfterCurrent } from "@api/chrome/tab"
import { I18nKey, t } from "@app/locale"
import { Ref } from "vue"
import { Router } from "vue-router"
import { MenuItem, MENUS } from "./item"

function openMenu(route: string, title: I18nKey, router: Router) {
    const currentPath = router.currentRoute.value?.path
    if (currentPath !== route) {
        router?.push(route)
        document.title = t(title)
    }
}

const openHref = (href: string) => createTabAfterCurrent(href)

export function handleClick(menuItem: MenuItem, router: Router, currentActive?: Ref<string>) {
    const { route, title, href } = menuItem
    if (route) {
        openMenu(route, title, router)
    } else {
        openHref(href)
        currentActive && (currentActive.value = router.currentRoute?.value?.path)
    }
}

export async function initTitle(router: Router) {
    await router.isReady()
    const currentPath = router.currentRoute.value.path
    for (const group of MENUS) {
        for (const { route, title } of group.children) {
            const docTitle = route === currentPath && t(title)
            if (docTitle) {
                document.title = docTitle
                return
            }
        }
    }
}