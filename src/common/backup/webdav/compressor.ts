/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { groupBy } from "@util/array"
import { formatPeriodCommon } from "@util/time"

const CLIENT_FIELDS: MarkdownTableField<timer.backup.Client>[] = [
    {
        name: "Client Id",
        formatter: (r) => r.id,
    },
    {
        name: "Client Name",
        formatter: (r) => r.name,
    },
    {
        name: "Earliest Date",
        formatter: (r) => r.minDate,
    },
    {
        name: "Latest Date",
        formatter: (r) => r.maxDate,
    },
]

type Meta = {
    version: number
    ts: number
}

const CURRENT_VER = 1

function genMetaLine(): string {
    const meta: Meta = { version: CURRENT_VER, ts: Date.now() }
    return genJsonLine(meta)
}

function genJsonLine(data: any): string {
    return `<!-- ${JSON.stringify(data)} -->`
}

export function convertClients2Markdown(
    clients: timer.backup.Client[]
): string {
    return genMarkdownTable(clients, CLIENT_FIELDS)
}

type CellFormatter<T> = string | number | ((row: T) => string | number)

type MarkdownTableField<T> = {
    name: string
    formatter: CellFormatter<T>
}

function genTableRow<T>(t: T, formatters: CellFormatter<T>[]): string {
    const cells = formatters?.map((f) => {
        const str =
            typeof f === "function"
                ? f?.(t)?.toString?.()?.replace("|", "&#124")
                : f?.toString?.()
        return str ?? "-"
    })
    return `|${cells.join("|")}|`
}

function genMarkdownTable<T>(
    list: T[],
    fields: MarkdownTableField<T>[]
): string {
    const lines: string[] = [genMetaLine(), genJsonLine(list)]
    list = list || []
    fields = fields || []
    if (fields.length) {
        // header
        lines.push(
            genTableRow(
                null,
                fields.map((f) => f.name)
            )
        )
        lines.push(
            genTableRow(
                null,
                fields.map((_) => "----")
            )
        )
        const cellFormatters = fields.map((f) => f.formatter)
        lines.push(...list.map((row) => genTableRow(row, cellFormatters)))
    }
    return lines.join("\n")
}

const ROW_FIELDS: MarkdownTableField<timer.stat.Row>[] = [
    {
        name: "Date",
        formatter: (r) => r.date,
    },
    {
        name: "Domain/URL",
        formatter: (r) => r.host,
    },
    {
        name: "Focus Time",
        formatter: (r) => formatPeriodCommon(r.focus || 0),
    },
    {
        name: "Visit Count",
        formatter: (r) => r.time || 0,
    },
]

export function divideByDate(rows: timer.stat.RowBase[]): {
    [date: string]: string
} {
    return groupBy(
        rows,
        (row) => row.date,
        (list) => genMarkdownTable(list, ROW_FIELDS)
    )
}

export function parseData<T>(markdown: string): T {
    let line2 = markdown?.split("\n")?.[1]
    if (!line2) {
        return null
    }
    line2 = line2?.replace("<!-- ", "").replace("-->", "").trim()
    if (!line2) return null
    return JSON.parse(line2)
}

export function parseWebDAVResponse(xmlData: string): WebDAVItem[] {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlData, "text/xml")

    const items: WebDAVItem[] = []

    const responses = xmlDoc.getElementsByTagName("D:response")
    for (let i = 0; i < responses.length; i++) {
        const response = responses[i]

        const hrefElement = response.getElementsByTagName("D:href")[0]
        const href = hrefElement.textContent?.trim() || ""

        const propElements = response.getElementsByTagName("D:propstat")
        if (propElements.length > 0) {
            const prop = propElements[0].getElementsByTagName("D:prop")[0]

            const resourceTypeElement =
                prop.getElementsByTagName("D:resourcetype")[0]
            const isCollection =
                resourceTypeElement.getElementsByTagName("D:collection")
                    .length > 0
            const displayNameElement =
                prop.getElementsByTagName("D:displayname")[0]
            const displayName = displayNameElement.textContent?.trim() || ""

            const contentLengthElement =
                prop.getElementsByTagName("D:getcontentlength")[0]
            const size = contentLengthElement
                ? parseInt(contentLengthElement.textContent || "0")
                : undefined

            const lastModifiedElement =
                prop.getElementsByTagName("D:getlastmodified")[0]
            const lastModifiedStr =
                lastModifiedElement.textContent?.trim() || ""
            const lastModified = lastModifiedStr
                ? new Date(lastModifiedStr)
                : undefined

            const item: WebDAVItem = {
                name: displayName,
                type: isCollection ? "directory" : "file",
                size,
                lastModified,
            }

            items.push(item)
        }
    }

    return items
}

interface WebDAVItem {
    name: string
    type: "file" | "directory"
    size?: number
    lastModified?: Date
}
