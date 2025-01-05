import SiteCateDatabase from "@db/site-cate-database"

const siteCateDatabase = new SiteCateDatabase(chrome.storage.local)

class CateService {

    listAll(): Promise<timer.site.Cate[]> {
        return siteCateDatabase.listAll()
    }

    add(name: string): Promise<timer.site.Cate> {
        return siteCateDatabase.add(name)
    }

    saveName(id: number, name: string): Promise<void> {
        return siteCateDatabase.update(id, name)
    }

    remove(id: number): Promise<void> {
        return siteCateDatabase.delete(id)
    }
}

export default new CateService()