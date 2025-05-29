/**
 * Copyright (c) 2021-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import Box from "@pages/components/Box"
import { ElIcon, ElMenu, ElMenuItem, ElMenuItemGroup } from "element-plus"
import { defineComponent, h, onMounted, ref, watch, type StyleValue } from "vue"
import { useRouter } from "vue-router"
import { MENUS } from "./item"
import { handleClick, initTitle } from "./route"

const ICON_STYLE: StyleValue = {
    paddingInline: '4px',
    height: '1em',
    lineHeight: '0.83em',
}

const _default = defineComponent(() => {
    const router = useRouter()
    const currentActive = ref<string>()
    const syncRouter = () => {
        const route = router.currentRoute.value
        route && (currentActive.value = route.path)
    }
    watch(router.currentRoute, syncRouter)

    onMounted(() => initTitle(router))

    return () => (
        <Box minHeight='100vh' bgColor="var(--el-menu-bg-color)">
            <ElMenu
                defaultActive={currentActive.value}
                style={{ border: 'none', paddingBlock: '10px' } satisfies StyleValue}
            >
                {MENUS.map(menu => (
                    <ElMenuItemGroup title={t(menu.title)}>
                        {menu.children.map(item => (
                            <ElMenuItem
                                index={item.index ?? item.route}
                                onClick={() => handleClick(item, router, currentActive)}
                                v-slots={{
                                    default: () => (
                                        <ElIcon size={18} style={ICON_STYLE}>
                                            {h(item.icon)}
                                        </ElIcon>
                                    ),
                                    title: () => <span>{t(item.title)}</span>
                                }}
                            />
                        ))}
                    </ElMenuItemGroup>
                ))}
            </ElMenu>
        </Box >
    )
})

export default _default