class ContentScript {
    matches?: string[];
    exclude_matches?: string[];
    css?: string[];
    js?: string[];
    run_at?: string;
    all_frames?: boolean;
    match_about_blank?: boolean;
    include_globs?: string[];
    exclude_globs?: string[];
}
export default class InstalledHandler {


    public handle() {
        const contentScripts: ContentScript[] = chrome.runtime.getManifest().content_scripts
        const inject = (tab: chrome.tabs.Tab) => {
            contentScripts.forEach((cs: ContentScript) => {
                (cs.js || []).forEach(jsFile => chrome.tabs.executeScript(tab.id, { file: jsFile }))
            })
        }
        // Get all windows
        chrome.windows.getAll({ populate: true }, (windows: chrome.windows.Window[]) => {
            // All the tabs inject the content scripts
            windows.forEach(window => {
                window.tabs
                    // Skip chrome pages
                    .filter(tab => {
                        !tab.url.match(/(chrome(-error)?):\/\//gi)
                    })
                    .forEach(tab => inject(tab))
            })
        })
    }
}
