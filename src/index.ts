import {app} from './app'
import {SETTINGS} from './settings'
import {DB} from "./db/mongoDB";


export const startApp = async () => {

    const db = new DB(SETTINGS.MONGO_URL + SETTINGS.DB_NAME)

    const res = await db.runDB();
    if (!res) {
        process.exit(1);
    }


    app.listen(SETTINGS.PORT, () => {
        console.log('...server started in port ' + SETTINGS.PORT)
    })
}

startApp()
