import path from 'path'
import fs from 'fs'
import { CrowdinClient } from './client'
import { exitWith } from '../util/process'

export const ALL_DIRS: Dir[] = ['app', 'common', 'popup', 'guide']

export const SOURCE_LOCALE: timer.SourceLocale = 'en'

// Not include en and zh_CN
export const ALL_TRANS_LOCALES: timer.Locale[] = [
    'ja',
    'zh_TW',
    'pt_PT',
]

const CROWDIN_I18N_MAP: Record<CrowdinLanguage, timer.Locale> = {
    en: 'en',
    ja: 'ja',
    'zh-CN': 'zh_CN',
    'zh-TW': 'zh_TW',
    'pt-PT': 'pt_PT',
}

const I18N_CROWDIN_MAP: Record<timer.Locale, CrowdinLanguage> = {
    en: 'en',
    ja: 'ja',
    zh_CN: 'zh-CN',
    zh_TW: 'zh-TW',
    pt_PT: 'pt-PT'
}

export const crowdinLangOf = (locale: timer.Locale) => I18N_CROWDIN_MAP[locale]

export const localeOf = (crowdinLang: CrowdinLanguage) => CROWDIN_I18N_MAP[crowdinLang]

const IGNORED_FILE: Partial<{ [dir in Dir]: string[] }> = {
    common: [
        // Strings for market
        'meta',
        // Name of locales
        'locale',
    ]
}

export function isIgnored(dir: Dir, fileName: string) {
    return !!IGNORED_FILE[dir]?.includes(fileName)
}

export const MSG_BASE = path.join(__dirname, '..', '..', 'src', 'i18n', 'message')
export const RSC_FILE_SUFFIX = "-resource.json"

/**
 * Read all messages from source file 
 * 
 * @param dir the directory of messages
 * @returns 
 */
export async function readAllMessages(dir: Dir): Promise<Record<string, Messages<any>>> {
    const dirPath = path.join(MSG_BASE, dir)

    const files = fs.readdirSync(dirPath)
    const result = {}
    await Promise.all(files.map(async file => {
        if (!file.endsWith(RSC_FILE_SUFFIX)) {
            return
        }
        const message = (await import(`@i18n/message/${dir}/${file}`))?.default as Messages<any>
        const name = file.replace(RSC_FILE_SUFFIX, '')
        message && (result[name] = message)
        return
    }))
    return result
}

/**
 * Merge crowdin message into locale resource json files
 * 
 * @param dir dir
 * @param filename the name of json file
 * @param messages crowdin messages
 */
export async function mergeMessage(
    dir: Dir,
    filename: string,
    messages: Partial<Record<timer.Locale, ItemSet>>
): Promise<void> {
    const dirPath = path.join(MSG_BASE, dir)
    const filePath = path.join(dirPath, filename)
    const existMessages = (await import(`@i18n/message/${dir}/${filename}`))?.default as Messages<any>
    if (!existMessages) {
        console.error(`Failed to find local code: dir=${dir}, filename=${filename}`)
        return
    }
    const sourceItemSet = transMsg(existMessages[SOURCE_LOCALE])
    Object.entries(messages).forEach(([locale, itemSet]) => {
        let existMessage: any = existMessages[locale] || {}
        Object.entries(itemSet).forEach(([path, text]) => {
            if (!text) {
                // Not translated
                return
            }
            const sourceText = sourceItemSet[path]
            if (!checkPlaceholder(text, sourceText)) {
                console.error(`Invalid placeholder: dir=${dir}, filename=${filename}, path=${path}, source=${sourceText}, translated=${text}`)
                return
            }
            const pathSeg = path.split('.')
            fillItem(pathSeg, 0, existMessage, text)
        })
        if (Object.keys(existMessage).length) {
            // Only merge the locale with any translated strings
            existMessages[locale] = existMessage
        }
    })

    const newFileContent = JSON.stringify(existMessages, null, 4)
    fs.writeFileSync(filePath, newFileContent, { encoding: 'utf-8' })
}

function checkPlaceholder(translated: string, source: string) {
    const allSourcePlaceholders =
        Array.from(source.matchAll(/\{(.*?)\}/g))
            .map(matched => matched[1])
            .sort()
    const allTranslatedPlaceholders =
        Array.from(translated.matchAll(/\{(.*?)\}/g))
            .map(matched => matched[1])
            .sort()
    if (allSourcePlaceholders.length != allTranslatedPlaceholders.length) {
        return false
    }
    for (let i = 0; i++; i < allSourcePlaceholders.length) {
        if (allSourcePlaceholders[i] !== allTranslatedPlaceholders[i]) {
            return false
        }
    }
    return true
}

function fillItem(fields: string[], index: number, obj: Object, text: string) {
    const field = fields[index]
    if (index === fields.length - 1) {
        obj[field] = text
        return
    }
    let sub = obj[field]
    if (sub === undefined) {
        obj[field] = sub = {}
    } else if (typeof sub !== 'object') {
        exitWith("Invalid key path: " + fields.join('.'))
    }
    fillItem(fields, index + 1, sub, text)
}

/**
 * Trans msg object to k-v map
 */
export function transMsg(message: any, prefix?: string): ItemSet {
    const result = {}
    const pathPrefix = prefix ? prefix + '.' : ''
    Object.entries(message).forEach(([key, value]) => {
        const path = pathPrefix + key
        if (typeof value === 'object') {
            const subResult = transMsg(value, path)
            Object.entries(subResult)
                .forEach(([path, val]) => result[path] = val)
        } else {
            let realVal = value
            // Replace tab with blank
            typeof value === 'string' && (realVal = value.replace(/\s{4}/g, ''))
            result[path] = realVal
        }
    })
    return result
}

export async function checkMainBranch(client: CrowdinClient) {
    const branch = await client.getMainBranch()
    if (!branch) {
        exitWith("Main branch is null")
    }
    return branch
}
