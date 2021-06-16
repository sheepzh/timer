import MergeRuleDatabase from "../../src/database/merge-rule-database"
import DomainMergeRuleItem from "../../src/entity/dto/domain-merge-rule-item"
import storage from "../__mock__/storage"

const db = new MergeRuleDatabase(storage.local)

describe('merge-rule-database.test', () => {
    beforeEach(async () => storage.local.clear())

    test('1', async () => {
        let toAdd: DomainMergeRuleItem[] = [DomainMergeRuleItem.of('4', 2)]
        await db.add(...toAdd)
        expect((await db.selectAll())).toEqual(expect.arrayContaining(toAdd))
        toAdd = [
            DomainMergeRuleItem.of('4'),
            DomainMergeRuleItem.of('3')
        ]
        await db.add(...toAdd)
        expect((await db.selectAll())).toEqual(expect.arrayContaining([
            // Not rewrite
            DomainMergeRuleItem.of('4', 2),
            DomainMergeRuleItem.of('3')
        ]))
        await db.remove('4')
        const list = await db.selectAll()
        expect(list.length).toEqual(1)
        expect(list[0]).toEqual(DomainMergeRuleItem.of('3', ''))
    })
})