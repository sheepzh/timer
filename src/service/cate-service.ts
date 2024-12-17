import SiteCateDatabase from "@db/site-cate-database"

const siteCateDatabase = new SiteCateDatabase(chrome.storage.local)

class CateService {

    listAllCategories(): Promise<timer.site.Cate[]> {
        return siteCateDatabase.listAll()
    }

    addCategory(name: string): Promise<timer.site.Cate> {
        return siteCateDatabase.add(name)
    }

    saveCategory(id: number, name: string): any {
        console.log(id, name)
        return siteCateDatabase.update(id, name)
    }
}

export default new CateService()