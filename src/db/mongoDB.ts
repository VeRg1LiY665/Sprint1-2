import {Collection, MongoClient} from "mongodb";
import {PostDBType} from "../Data Types/PostDBType";
import {BlogDBType} from "../Data Types/BlogDBType";
import {SETTINGS} from "../settings";


export let postsCollection = Collection<PostDBType>
export let blogsCollection = Collection<BlogDBType>

export async function runDB(url:string):Promise<boolean> {
    let client = new MongoClient(url);
    let db = client.db(SETTINGS.DB_NAME)

try {
        await client.connect();
        await db.command({ping:1});
        console.log("Database Connected");
        return true;
}  catch (e){
        console.log(e);
        await client.close();
        return false;
}
}