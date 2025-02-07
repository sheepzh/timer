import { type Config } from "@jest/types"
import tsConfig from './tsconfig.json'

const paths = tsConfig.compilerOptions.paths

const aliasPattern = /^(@.*)\/\*$/
const sourcePattern = /^(.*)\/\*$/

const moduleNameMapper: { [key: string]: string } = {}

Object.entries(paths).forEach(([alias, sourceArr]) => {
    if (!aliasPattern.test(alias)) {
        return
    }
    if (sourceArr.length !== 1 || !sourcePattern.test(sourceArr[0])) {
        return
    }
    const prefix = alias.match(aliasPattern)[1]
    const pattern = `^${prefix}/(.*)$`
    const source = sourceArr[0].match(sourcePattern)[1]
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