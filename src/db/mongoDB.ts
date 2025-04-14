import {SETTINGS} from "../settings";
import mongoose from "mongoose";
import {blogsSchema} from "../Schemas/blogsSchema";
import {postsSchema} from "../Schemas/postsSchema";
import {commentsSchema} from "../Schemas/commentsSchema";
import {usersSchema} from "../Schemas/usersSchema";
import {devicesSchema} from "../Schemas/deviceSchema";
import {requestsSchema} from "../Schemas/requestSchema";



export const BlogModel = mongoose.model("blogs", blogsSchema);
export const PostModel = mongoose.model("posts", postsSchema);
export const CommentModel = mongoose.model("comments", commentsSchema);
export const UserModel = mongoose.model("users", usersSchema);
export const DeviceModel = mongoose.model("devices", devicesSchema);
export const ReqModel = mongoose.model("requests", requestsSchema);


export const db = {

    async runDB(url: string): Promise<boolean> {

        try {
            await mongoose.connect(url);  //connect to db with mongoose

            if (mongoose.connection.readyState === 1)
            {console.log('Connected successfully to mongo server');}
            return true;

        } catch (e: unknown) {
            console.error("Can't connect to mongo server", e);

            await mongoose.disconnect();
            return false;
        }
    },

    async stop() {
        await mongoose.disconnect();
        console.log('Connection successful closed');
    },

    async drop(url:string) {
        try {
            await mongoose.connect(url);
                await mongoose.connection.db!.dropDatabase();  //даже с проверкой все равно ts ругается на possibly undefined
                console.log('db dropped successfully')


        } catch (e: unknown) {
            console.error('Error in drop db:', e);
            await mongoose.disconnect();
        }
    },

}