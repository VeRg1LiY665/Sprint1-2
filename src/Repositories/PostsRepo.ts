import {InputPostType} from "../IO Types/InputPostType";
import {postsCollection} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import {PostDBType} from "../Data Types/PostDBType";
import {NotFoundError} from "../helpers/ErrorHandler";

export const PostsRepo = {

    async ShowPostByID(id:string) {
        const post = await postsCollection.findOne({_id: new ObjectId(id)})
        if (!post) {
            return null;
        }
        return (post)
    },

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