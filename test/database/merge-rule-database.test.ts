import MergeRuleDatabase from "../../src/database/merge-rule-database"
import HostMergeRuleItem from "../../src/entity/dto/host-merge-rule-item"
import storage from "../__mock__/storage"

const db = new MergeRuleDatabase(storage.local)

describe('merge-rule-database.test', () => {
    beforeEach(async () => storage.local.clear())

    test('1', async () => {
        let toAdd: HostMergeRuleItem[] = [HostMergeRuleItem.of('4', 2)]
        await db.add(...toAdd)
        expect((await db.selectAll())).toEqual(expect.arrayContaining(toAdd))
        toAdd = [
            HostMergeRuleItem.of('4'),
            HostMergeRuleItem.of('3')
        ]
        await db.add(...toAdd)
        expect((await db.selectAll())).toEqual(expect.arrayContaining([
            // Not rewrite
            HostMergeRuleItem.of('4', 2),
            HostMergeRuleItem.of('3')
        ]))
        await db.remove('4')
        const list = await db.selectAll()
        expect(list.length).toEqual(1)
        expect(list[0]).toEqual(HostMergeRuleItem.of('3', ''))
    })
})