import ArchivedDatabase from '../../src/database/archived-database'
import { DATE_FORMAT } from '../../src/database/common/constant'
import SiteInfo from '../../src/entity/dto/site-info'
import { formatTime, MILL_PER_DAY } from '../../src/util/time'
import storage from '../__mock__/storage'

const archivedDatabase = new ArchivedDatabase(storage.local)
const nowTs = Date.now()
const now = formatTime(nowTs, DATE_FORMAT)
const yesterday = formatTime(nowTs - MILL_PER_DAY, DATE_FORMAT)
const beforeYesterday = formatTime(nowTs - MILL_PER_DAY * 2, DATE_FORMAT)
const baidu = 'www.baidu.com'

describe('archived-database', () => {
    beforeEach(async () => storage.local.clear())
    test('1', async () => {
        await archivedDatabase.updateArchived([
            new SiteInfo({ host: baidu, date: now }, { focus: 1, total: 1, time: 0 }),
            new SiteInfo({ host: baidu, date: yesterday }, { focus: 1, total: 0, time: 2 }),
        ])
        await archivedDatabase.updateArchived([new SiteInfo({ host: baidu, date: beforeYesterday }, { focus: 0, total: 1, time: 2 })])
        const result = await archivedDatabase.selectArchived(new Set([baidu]))
        expect(result.length).toEqual(1)
        const baiduInfo = result[0]
        expect(baiduInfo.focus).toEqual(2)
        expect(baiduInfo.total).toEqual(2)
        expect(baiduInfo.time).toEqual(4)
    })

    test('2', async () => {
        const key = `_a_${baidu}`
        const toImport = {}
        toImport[key] = {
            focus: 1,
            time: 2,
            total: 3
        }
        await archivedDatabase.importData(toImport)
        const result = await archivedDatabase.selectArchived(new Set([baidu]))
        expect(result.length).toEqual(1)
        const baiduInfo = result[0]
        expect(baiduInfo.focus).toEqual(1)
        expect(baiduInfo.time).toEqual(2)
        expect(baiduInfo.total).toEqual(3)
    })

    test('3', async () => {
        const key = `_a_${baidu}`
        const toImport = {}
        toImport[key] = {}
        await archivedDatabase.importData(toImport)
        const result = await archivedDatabase.selectArchived(new Set([baidu]))
        expect(result.length).toEqual(1)
        const baiduInfo = result[0]
        expect(baiduInfo.focus).toEqual(0)
        expect(baiduInfo.time).toEqual(0)
        expect(baiduInfo.total).toEqual(0)
    })
})