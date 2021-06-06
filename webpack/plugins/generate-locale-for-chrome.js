const path = require('path')
const fs = require('fs')

// Genearate the messages used by Chrome
function translate (obj, parentKey = '') {
    const result = {}
    if (typeof obj === 'object') {
        for (const key in obj) {
            const val = obj[key]
            // key of Chrome message
            const messageKey = !!parentKey ? `${parentKey}_${key}` : key
            const children = translate(val, messageKey)
            // copy from child
            for (const childKey in children) {
                result[childKey] = children[childKey]
            }
        }
    } else {
        result[parentKey] = {
            message: obj + '',
            description: 'None'
        }
    }
    return result
}

/**
 * The plugin to generate locale message files for browser
 */
class GenerateLocaleForChrome {
    /**
     * @param {*} name        the file name to generate
     * @param {*} importFile 
     */
    constructor(name, importFile) {
        this.outputFileName = `generate_locale_messages_for_chrome_${name}`
        this.outputFileImport = importFile
    }
    async apply (compiler) {
        const options = compiler.options
        options.entry[this.outputFileName] = { import: [this.outputFileImport] }
        const outputPath = options.output.path
        const outFilePath = path.join(outputPath, `${this.outputFileName}.js`)
        compiler.hooks.done.tap('GenerateLocaleForChromePlugin', () => {
            require(outFilePath)
            const messages = global.exportsToChrome
            for (const localeName in messages) {
                // .e.g
                // {
                //     "lang.name": {
                //         message: "English",
                //         description: ""
                //     }
                // }
                const chromeMessage = translate(messages[localeName])
                const dir = path.join(outputPath, '_locales', localeName)
                fs.mkdirSync(dir, { recursive: true })
                fs.writeFileSync(path.join(dir, 'messages.json'), JSON.stringify(chromeMessage))
            }
            if (options.mode !== 'development') {
                fs.unlinkSync(outFilePath)
                const mapFile = outFilePath + '.map'
                if (fs.existsSync(mapFile)) {
                    fs.unlinkSync(mapFile)
                }
            }
        })
    }
}

module.exports = GenerateLocaleForChrome