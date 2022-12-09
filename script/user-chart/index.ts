import { add } from "./add"
import { parseArgv } from "./argv"
import { exitWith } from "../util/process"
import { render } from "./render"

function main() {
    const argv = parseArgv()
    switch (argv.cmd) {
        case 'add':
            add(argv)
            break
        case 'render':
            render(argv)
            break
        default:
            exitWith('Unsupported cmd: ' + JSON.stringify(argv))
    }
}

main()