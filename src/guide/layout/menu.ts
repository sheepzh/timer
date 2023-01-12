/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ref, VNode } from "vue"
import ElementIcon from "@src/element-ui/icon"
import { I18nKey, t } from "@guide/locale"
import { ElIcon, ElMenu, ElMenuItem, ElSubMenu } from "element-plus"
import { defineComponent, h } from "vue"
import { User, Memo, MagicStick } from "@element-plus/icons-vue"

type _Item = {
    title: I18nKey
    position: Position
}

type _Group = {
    title: I18nKey
    position: Position
    children: _Item[]
    icon: ElementIcon
}

const quickstartPosition: Position = 'usage.quickstart'
const profilePosition: Position = 'profile'
const menus: _Group[] = [
    {
        title: msg => msg.layout.menu.usage.title,
        position: 'usage',
        children: [
            {
                title: msg => msg.layout.menu.usage.quickstart,
                position: quickstartPosition
            }, {
                title: msg => msg.layout.menu.usage.background,
                position: 'usage.background'
            }, {
                title: msg => msg.layout.menu.usage.advanced,
                position: 'usage.advanced'
            }, {
                title: msg => msg.layout.menu.usage.backup,
                position: 'usage.backup',
            }
        ],
        icon: Memo
    },
    {
        title: msg => msg.layout.menu.privacy.title,
        position: 'privacy',
        icon: User,
        children: [
            {
                title: msg => msg.layout.menu.privacy.scope,
                position: 'privacy.scope'
            },
            {
                title: msg => msg.layout.menu.privacy.storage,
                position: 'privacy.storage'
            },
        ],

    }
]

function renderMenuItem(handleClick: (position: Position) => void, item: _Item, index: number): VNode {
    const { title, position } = item
    return h(ElMenuItem, {
        index: position,
        onClick: () => handleClick(position)
    }, () => h('span', {}, `${index + 1}. ${t(title)}`))
}

function renderGroup(handleClick: (position: Position) => void, group: _Group): VNode {
    const { position, title, children, icon } = group
    return h(ElSubMenu, {
        index: position,
    }, {
        title: () => [
            h(ElIcon, () => h(icon)),
            h('span', {}, t(title))
        ],
        default: () => children.map(
            (item, index) => renderMenuItem(handleClick, item, index)
        )
    })
}

const _default = defineComponent({
    name: "GuideMenu",
    emits: {
        click: (_position: Position) => true,
    },
    setup(_, ctx) {
        const handleClick = (position: Position) => ctx.emit('click', position)
        const menuItems = () => [
            h(ElMenuItem, {
                index: profilePosition,
                onClick: () => handleClick(profilePosition)
            }, () => [
                h(ElIcon, () => h(MagicStick)),
                h('span', {}, t(msg => msg.layout.menu.profile, { appName: t(msg => msg.meta.name) }))
            ]),
            ...menus.map(
                group => renderGroup(handleClick, group)
            )
        ]
        const menuRef = ref()
        return () => h(ElMenu, {
            defaultActive: profilePosition,
            defaultOpeneds: menus.map(group => group.position),
            ref: menuRef,
            onClose(index: string) {
                menuRef.value?.open?.(index)
            }
        }, menuItems)
    }
})

export default _default