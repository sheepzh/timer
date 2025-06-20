import { type Config } from "@jest/types"
import { compilerOptions } from './tsconfig.json'

const { paths } = compilerOptions

const aliasPattern = /^(@.*)\/\*$/
const sourcePattern = /^(.*)\/\*$/

const moduleNameMapper: { [key: string]: string } = {}

Object.entries(paths).forEach(([alias, sourceArr]) => {
    const aliasMatch = alias.match(aliasPattern)
    if (!aliasMatch) {
        return
    }
    if (sourceArr.length !== 1) {
        return
    }
    const sourceMath = sourceArr[0]?.match(sourcePattern)
    if (!sourceMath) {
        return
    }
    const prefix = aliasMatch[1]
    const pattern = `^${prefix}/(.*)$`
    const source = sourceMath[1]
    const sourcePath = `<rootDir>/${source}/$1`
    moduleNameMapper[pattern] = sourcePath
})

console.log("The moduleNameMapper parsed from tsconfig.json: ")
console.log(moduleNameMapper)

const config: Config.InitialOptions = {
    moduleNameMapper,
    roots: [
        "<rootDir>/test",
        "<rootDir>/test-e2e",
    ],
    testRegex: '(.+)\\.test\\.(jsx?|tsx?)$',
    transform: {
        "^.+\\.tsx?$": "@swc/jest"
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}

export default config