import {Collection, Db, MongoClient} from "mongodb";
import {PostDBType} from "../Data Types/PostDBType";
import {BlogDBType} from "../Data Types/BlogDBType";
import {SETTINGS} from "../settings";
import {UserDBType} from "../Data Types/UserDBType";
import {CommentDBType} from "../Data Types/CommentDBType";


export let postsCollection: Collection<PostDBType>
export let blogsCollection: Collection<BlogDBType>
export let usersCollection: Collection<UserDBType>
export let commentsCollection: Collection<CommentDBType>

export const db = {
    client: {} as MongoClient,

    getDbName(): Db {
        return this.client.db(SETTINGS.DB_NAME);
    },

    async runDB(url: string): Promise<boolean> {
       /* let client = new MongoClient(url);
        let db = client.db(SETTINGS.DB_NAME)

        blogsCollection = db.collection<BlogDBType>(SETTINGS.PATH.BLOGS);
        postsCollection = db.collection<PostDBType>(SETTINGS.PATH.POSTS);
        usersCollection = db.collection<UserDBType>(SETTINGS.PATH.USERS);

        try {
            await client.connect();
            await db.command({ping: 1});
            console.log("Database Connected");
            return true;
        } catch (e) {
            console.log(e);
            await client.close();
            return false;
        }*/

        try {
            this.client = new MongoClient(url);
            let db = this.client.db(SETTINGS.DB_NAME)

            blogsCollection = db.collection<BlogDBType>(SETTINGS.PATH.BLOGS);
            postsCollection = db.collection<PostDBType>(SETTINGS.PATH.POSTS);
            usersCollection = db.collection<UserDBType>(SETTINGS.PATH.USERS);
            commentsCollection = db.collection<CommentDBType>(SETTINGS.PATH.COMMENTS);

            await this.client.connect();
            await this.getDbName().command({ ping: 1 });
            console.log('Connected successfully to mongo server');
            return true;
        } catch (e: unknown) {
            console.error("Can't connect to mongo server", e);
            await this.client.close();
            return false;
        }
    },

    async stop() {
        await this.client.close();
        console.log('Connection successful closed');
    },

    async drop() {
        try {
            await this.getDbName().dropDatabase()
            /*const collections = await this.getDbName().listCollections().toArray();

            for (const collection of collections) {
                const collectionName = collection.name;
                await this.getDbName().collection(collectionName).deleteMany({});
            }*/
        } catch (e: unknown) {
            console.error('Error in drop db:', e);
            await this.stop();
        }
    },
    getCollections() {
        return {
            usersCollection:  this.getDbName().collection('users'),
            blogsCollection:  this.getDbName().collection('blogs'),
            postsCollection:  this.getDbName().collection('posts'),
            commentsCollection:  this.getDbName().collection('comments'),
        };
    },
}