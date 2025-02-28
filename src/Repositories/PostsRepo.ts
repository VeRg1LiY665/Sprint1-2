import {InputPostType} from "../IO Types/InputPostType";
import {postsCollection} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import {PostDBType} from "../Data Types/PostDBType";

export const PostsRepo = {

    async DeletePost (id:string) {
        const res = await postsCollection.deleteOne({_id : new ObjectId(id)})
        return res.deletedCount === 1;
    },

    async SetUpNewPost(content:PostDBType) {
        try {await postsCollection.insertOne(content)}
        catch (e) {
            console.error(e);
            return false;
        }
        return true
    },

    async ChangePost (id: string, content:InputPostType) {

        const res = await postsCollection.updateOne(
            {_id:new ObjectId(id)},
            {$set:{...content}}
        )
        return res.matchedCount===1
    }

}