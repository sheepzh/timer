// Declare for 'filemanager-webpack-plugin'
declare module 'filemanager-webpack-plugin' {
    type Endpoint = 'onEnd'
    // Sequence
    type OperationSeq = Partial<Record<CommandName, CommandConfig>>
    type CommandName = 'delete' | 'copy' | 'archive' | 'move'
    type CommandConfig = string[] | { source: string, destination: string }[]

    type Options = Partial<Record<Endpoint, OperationSeq[]>>

    class FilemanagerWebpackPlugin {
        constructor(config: { events: Options })
    }
    export default FilemanagerWebpackPlugin
}