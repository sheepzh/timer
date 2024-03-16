/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getTranslationStatus, TranslationStatusInfo } from "@api/crowdin"
import { ElLoading, ElProgress, ProgressProps } from "element-plus"
import { defineComponent, onMounted, Ref, ref } from "vue"
import localeMessages from "@i18n/message/common/locale"
import { t } from "@app/locale"

type SupportedLocale = timer.Locale | timer.TranslatingLocale

const localeCrowdMap: { [locale in SupportedLocale]: string } = {
    en: "en",
    zh_CN: "zh-CN",
    ja: "ja",
    zh_TW: "zh-TW",
    de: "de",
    es: "es-ES",
    ko: "ko",
    pl: "pl",
    pt_PT: "pt-PT",
    ru: "ru",
    uk: "uk",
    fr: "fr",
    it: "it",
    sv: "sv-SE",
    fi: "fi",
    da: "da",
    hr: "hr",
    id: "id",
    tr: "tr",
    cs: "cs",
    ro: "ro",
    nl: "nl",
    vi: "vi",
    sk: "sk",
    mn: "mn",
}

const crowdLocaleMap: { [locale: string]: SupportedLocale } = {}

Object.entries(localeCrowdMap).forEach(([locale, crowdLang]) => crowdLocaleMap[crowdLang] = locale as SupportedLocale)

type ProgressInfo = {
    locale: SupportedLocale | string
    progress: number
}

function convert2Info(translationStatus: TranslationStatusInfo): ProgressInfo {
    const { languageId, translationProgress } = translationStatus
    return {
        locale: crowdLocaleMap[languageId] || languageId,
        progress: translationProgress
    }
}

function computeType(progress: number): ProgressProps["status"] {
    if (progress >= 95) {
        return "success"
    } else if (progress >= 50) {
        return ""
    } else {
        return "warning"
    }
}

const CONTAINER_CLZ = 'progress-container'

async function queryData(listRef: Ref<ProgressInfo[]>) {
    const loading = ElLoading.service({ target: `.${CONTAINER_CLZ}`, text: t(msg => msg.helpUs.loading) })
    const langList = await getTranslationStatus()
    listRef.value = langList.map(convert2Info)
        .sort((a, b) => {
            const progressDiff = b.progress - a.progress
            if (progressDiff === 0) {
                return a.locale.localeCompare(b.locale)
            } else {
                return progressDiff
            }
        })
    loading.close()
}

const _default = defineComponent(() => {
    const list: Ref<ProgressInfo[]> = ref([])
    onMounted(() => queryData(list))
    return () => (
        <div class={CONTAINER_CLZ}>
            {list.value.map(({ locale, progress }) => (
                <ElProgress percentage={progress} strokeWidth={22} status={computeType(progress)}>
                    <span class="progress-text">{`${progress}%`}</span>
                    <span class="language-name">{localeMessages[locale]?.name || locale}</span>
                </ElProgress>
            ))}
        </div>
    )
})

export default _default