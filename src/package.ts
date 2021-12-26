/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import packageJson from '../package.json'

// The declaration of package.json
type _PackageJson = {
    name: string
    description: string
    version: string
    homepage: string
    author: string
}

const _default: _PackageJson = {
    name: packageJson.name,
    description: packageJson.description,
    version: packageJson.version,
    homepage: packageJson.homepage,
    author: packageJson.author
}

export default _default