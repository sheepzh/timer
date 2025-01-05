import cateService from "@service/cate-service"
import siteService from "@service/site-service"
import { Migrator } from "./common"

type InitialCate = {
    name: string
    hosts: string[]
}

const DEMO_ITEMS: InitialCate[] = [
    {
        name: 'Video',
        hosts: [
            'www.youtube.com',
            'www.bilibili.com',
        ],
    }, {
        name: 'Tech',
        hosts: [
            'github.com',
            'stackoverflow.com',
        ],
    }, {
        name: 'Info',
        hosts: [
            'www.baidu.com',
            'www.google.com',
        ],
    }
]

async function initItem(item: InitialCate) {
    const { name, hosts } = item
    const cate = await cateService.add(name)
    const cateId = cate?.id
    const siteKeys = hosts.map(host => ({ host, type: 'normal' } satisfies timer.site.SiteKey))
    await siteService.batchSaveCate(cateId, siteKeys)
}

export default class CateInitializer implements Migrator {
    async onInstall(): Promise<void> {
        DEMO_ITEMS.forEach(initItem)
    }

    onUpdate(version: string): void {
        version === '3.0.0' && this.onInstall()
    }
}