import ArchivedDatabase from '../../src/database/archived-database'
import { DATE_FORMAT } from '../../src/database/constant'
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
            new SiteInfo(baidu, now, 1, 1, 0),
            new SiteInfo(baidu, yesterday, 1, 0, 2),
        ])
        await archivedDatabase.updateArchived([new SiteInfo(baidu, beforeYesterday, 0, 1, 2)])
        const result = await archivedDatabase.selectArchived(new Set([baidu]))
        expect(result.length).toEqual(1)
        const baiduInfo = result[0]
        expect(baiduInfo.focus).toEqual(2)
        expect(baiduInfo.total).toEqual(2)
        expect(baiduInfo.time).toEqual(4)
    })
})