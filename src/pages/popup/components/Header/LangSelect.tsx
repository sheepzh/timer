import { ALL_LOCALES, localeSameAsBrowser, t } from "@i18n"
import optionMessages from "@i18n/message/app/option"
import localeMessages from "@i18n/message/common/locale"
import { useShadow, useState } from "@pages/hooks"
import { groupBy } from "@util/array"
import { classNames } from "@util/style"
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon, ElText } from "element-plus"
import { defineComponent, nextTick, PropType } from "vue"

// Keep the locale same as this browser first position
const SORTED_LOCALES: timer.Locale[] = ALL_LOCALES.sort((a, _b) => a === localeSameAsBrowser ? -1 : 0)

const LangSelect = defineComponent({
    props: {
        modelValue: String as PropType<timer.option.LocaleOption>,
    },
    emits: {
        change: (_val: timer.option.LocaleOption) => true,
    },
    setup(props, ctx) {
        const [lang, setLang] = useShadow(() => props.modelValue)
        const { default: input } = ctx.slots || {}

        const allLocaleOptions: timer.option.LocaleOption[] = ["default", ...SORTED_LOCALES]
        const optionCols = groupBy(allLocaleOptions, (_, idx) => idx % 2, l => l)

        const [visible, setVisible] = useState(false)
        const handleLanChange = (opt: timer.option.LocaleOption) => {
            console.log('change', opt)
            setVisible(false)
            nextTick(() => {
                ctx.emit('change', opt)
                setLang(opt)
            })
        }

        return () => (
            <ElDropdown
                size="small"
                v-slots={{
                    default: () => (
                        <ElIcon>
                            <svg
                                viewBox="0 0 24 24"
                                width="1.2em" height="1.2em"
                            >
                                <path
                                    fill="currentColor"
                                    d="m18.5 10l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16.5 10h2zM10 2v2h6v2h-1.968a18.222 18.222 0 0 1-3.62 6.301a14.864 14.864 0 0 0 2.336 1.707l-.751 1.878A17.015 17.015 0 0 1 9 13.725a16.676 16.676 0 0 1-6.201 3.548l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042A18.078 18.078 0 0 1 4.767 8h2.24A16.032 16.032 0 0 0 9 10.877a16.165 16.165 0 0 0 2.91-4.876L2 6V4h6V2h2zm7.5 10.885L16.253 16h2.492L17.5 12.885z"
                                />
                            </svg>
                        </ElIcon>
                    ),
                    dropdown: () => (
                        <ElDropdownMenu>
                            {SORTED_LOCALES.map(locale => (
                                <ElDropdownItem class={classNames(locale === 'en' && 'is-selected')}>
                                    {localeMessages?.[locale]?.name ?? locale}
                                </ElDropdownItem>
                            ))}
                            <ElDropdownItem divided>
                                {t(optionMessages, { key: m => m.appearance.locale.default })}
                            </ElDropdownItem>
                        </ElDropdownMenu>
                    )
                }}
            />
        )
    }
})

export default LangSelect