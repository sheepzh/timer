
/**
 * @throws Will invoke ```process.exit()```
 */
export function exitWith(msg: string) {
    console.error(msg)
    process.exit()
}