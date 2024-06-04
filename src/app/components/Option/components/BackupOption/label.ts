import { t } from "@app/locale";

export const ALL_TYPES: timer.backup.Type[] = [
    "none",
    "gist",
    "webdav",
    "obsidian_local_rest_api",
];

export const AUTH_LABELS: {
    [t in timer.backup.Type]: { name: string; label: string, info?: string }[];
} = {
    none: [],
    gist: [{ name: "token", label: "label", info: "authInfo" }],
    webdav: [
        { name: "username", label: "usernameLabel" },
        { name: "password", label: "passwordLabel" },
    ],
    obsidian_local_rest_api: [
        { name: "token", label: "authLabel" },
    ],
};

export const EXT_LABELS: {
    [t in timer.backup.Type]: { name: string; label: string, info?: string }[];
} = {
    none: [],
    gist: [],
    webdav: [
        { name: "endpoint", label: "endpointLabel", info: "endpointInfo" },
        { name: "dirPath", label: "pathLabel" },
    ],
    obsidian_local_rest_api: [
        { name: "endpoint", label: "endpointLabel", info: "endpointInfo" },
        { name: "dirPath", label: "pathLabel" },
    ],
};

export const TYPE_NAMES: { [t in timer.backup.Type]: string } = {
    none: t((msg) => msg.option.backup.meta.none.label),
    gist: "GitHub Gist",
    webdav: "WebDAV",
    obsidian_local_rest_api: "Obsidian - Local REST API",
};
