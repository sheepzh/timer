import { t } from "@app/locale";

export const ALL_TYPES: timer.backup.Type[] = [
    "none",
    "gist",
    "webdav",
    "obsidian_local_rest_api",
];

export const AUTH_LABELS: {
    [t in timer.backup.Type]: { name: string; label: string }[];
} = {
    none: [],
    gist: [{ name: "token", label: "Personal Access Token {info} {input}" }],
    webdav: [
        { name: "username", label: "Username {input}" },
        { name: "password", label: "Password {input}" },
    ],
    obsidian_local_rest_api: [
        { name: "token", label: "Authorization {input}" },
    ],
};

export const EXT_LABELS: {
    [t in timer.backup.Type]: { name: string; label: string }[];
} = {
    none: [],
    gist: [],
    webdav: [
        { name: "endpoint", label: "服务地址 {input}" },
        { name: "dirPath", label: "文件夹路径 {input}" },
    ],
    obsidian_local_rest_api: [
        { name: "endpoint", label: "服务地址 {input}" },
        { name: "dirPath", label: "文件夹路径 {input}" },
    ],
};

export const TYPE_NAMES: { [t in timer.backup.Type]: string } = {
    none: t((msg) => msg.option.backup.meta.none.label),
    gist: "GitHub Gist",
    webdav: "WebDAV",
    obsidian_local_rest_api: "Obsidian - Local REST API",
};
