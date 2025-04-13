import {Collection, Db, MongoClient} from "mongodb";
import {PostDBType} from "../Data Types/PostDBType";
import {BlogDBType} from "../Data Types/BlogDBType";
import {SETTINGS} from "../settings";
import {UserDBType} from "../Data Types/UserDBType";
import {CommentDBType} from "../Data Types/CommentDBType";
import {DeviceDBType} from "../Data Types/DeviceDBType";
import {ReqDBType} from "../Data Types/ReqDBType";
import mongoose from "mongoose";


export let postsCollection: Collection<PostDBType>
export let blogsCollection: Collection<BlogDBType>
export let usersCollection: Collection<UserDBType>
export let commentsCollection: Collection<CommentDBType>
export let devicesCollection: Collection<DeviceDBType>
export let requestsCollection:Collection<ReqDBType>
export let likesCollection:Collection

export const db = {
    client: {} as MongoClient,

    getDbName(): Db {
        return this.client.db(SETTINGS.DB_NAME);
    },

    async runDB(url: string): Promise<boolean> {

        try {
          /*  this.client = new MongoClient(url);
            let db = this.client.db(SETTINGS.DB_NAME)

            blogsCollection = db.collection<BlogDBType>(SETTINGS.PATH.BLOGS);
            postsCollection = db.collection<PostDBType>(SETTINGS.PATH.POSTS);
            usersCollection = db.collection<UserDBType>(SETTINGS.PATH.USERS);
            commentsCollection = db.collection<CommentDBType>(SETTINGS.PATH.COMMENTS);
            devicesCollection = db.collection<DeviceDBType>(SETTINGS.PATH.DEVICES);
            requestsCollection = db.collection<ReqDBType>(SETTINGS.PATH.REQUESTS);
            likesCollection = db.collection(SETTINGS.PATH.LIKES);*/

            //await this.client.connect();  //connect to db with mongo driver
            await mongoose.connect(url);  //connect to db with mongoose

            await this.getDbName().command({ ping: 1 });
            console.log('Connected successfully to mongo server');
            return true;
        } catch (e: unknown) {
            console.error("Can't connect to mongo server", e);
           // await this.client.close();
            await mongoose.disconnect();
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
            devicesCollection:  this.getDbName().collection('devices'),
            requestsCollection:  this.getDbName().collection('requests'),
            likesCollection:  this.getDbName().collection('likes'),
        };
    },
}