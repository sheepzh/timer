/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getTranslationStatus, TranslationStatusInfo } from "@api/crowdin"
import { ElLoading, ElProgress } from "element-plus"
import { defineComponent, h, onMounted, Ref, ref, VNode } from "vue"
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
    pt: "pt-PT",
    pt_BR: "pt-BR",
    ru: "ru",
    uk: "uk",
    fr: "fr",
    it: "it",
    sv: "sv-SE",
}

const crowdLocaleMap: { [locale: string]: SupportedLocale } = {}

Object.entries(localeCrowdMap).forEach(([locale, crwodLang]) => crowdLocaleMap[crwodLang] = locale as SupportedLocale)

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

function computeType(progress: number): 'success' | '' | 'warning' {
    if (progress >= 95) {
        return "success"
    } else if (progress >= 80) {
        return ""
    } else {
        return "warning"
    }
}

function renderProgressItem(progressInfo: ProgressInfo): VNode {
    const { locale, progress } = progressInfo
    return h(ElProgress, { percentage: progress, strokeWidth: 22, status: computeType(progress) }, () => [
        h('span', { class: 'progress-text' }, `${progress}%`),
        h('span', { class: 'language-name' }, localeMessages[locale]?.name || locale),
    ])
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

const _default = defineComponent({
    name: 'HelpUsProgressList',
    setup() {
        const list: Ref<ProgressInfo[]> = ref([])
        onMounted(() => queryData(list))
        return () => h('div', { class: CONTAINER_CLZ }, list.value.map(renderProgressItem))
    },
})

export default _default