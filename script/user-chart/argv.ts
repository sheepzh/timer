import { exitWith } from "../util/process"

type Cmd =
    | 'add'
    | 'render'

type ArgvBase = {
    cmd: Cmd
    gistToken: string
}

export type RenderArgv = ArgvBase & {
    cmd: 'render'
}

export type Browser =
    | 'chrome'
    | 'firefox'
    | 'edge'

export type AddArgv = ArgvBase & {
    cmd: 'add'
    browser: Browser
    fileName: string
}

export type Argv =
    | RenderArgv
    | AddArgv

export function parseArgv(): Argv {
    const argv = process.argv.slice(2)
    const cmd: Cmd = argv[0] as Cmd

    const token = process.env.TIMER_USER_COUNT_GIST_TOKEN
    if (!token) {
        exitWith("Can't find token from env variable [TIMER_USER_COUNT_GIST_TOKEN]")
    }
    if (cmd === 'add') {
        return parseAddArgv(argv, token)
    } else if (cmd === 'render') {
        return { gistToken: token, cmd: 'render' } as RenderArgv
    } else {
        console.error("Supported command: render, add")
        process.exit()
    }
}

function parseAddArgv(argv: string[], token: string): AddArgv {
    const browserArgv = argv[1]
    const fileName = argv[2]
    if (!browserArgv || !fileName) {
        exitWith("add [c/e/f] [file_name]")
    }
    const browserArgvMap: Record<string, Browser> = {
        c: 'chrome',
        e: 'edge',
        f: 'firefox',
    }
    const browser: Browser = browserArgvMap[browserArgv]
    if (!browser) {
        exitWith("add [c/e/f] [file_name]")
    }
    return {
        cmd: 'add',
        gistToken: token,
        browser,
        fileName
    }
}