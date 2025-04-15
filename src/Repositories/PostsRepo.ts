import {InputPostType} from "../IO Types/InputPostType";
import {PostModel} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import {PostDBType} from "../Data Types/PostDBType";
import {injectable} from "inversify";

@injectable()
export class PostsRepo {
    async ShowPostByID(id:string) {
        const post = await PostModel.findOne({_id: new ObjectId(id)}).lean()
        if (!post) {
            return null;
        }
        return (post)
    }

    async DeletePost (id:string) {
        const res = await PostModel.deleteOne({_id : new ObjectId(id)})
        return res.deletedCount === 1;
    }

    async SetUpNewPost(content:PostDBType) {
        try {await PostModel.insertOne(content)}
        catch (e) {
            console.error(e);
            return false;
        }
        return true
    }

    async ChangePost (id: string, content:InputPostType) {

        const res = await PostModel.updateOne(
            {_id:new ObjectId(id)},
            {$set:{...content}}
        )
        return res.matchedCount===1
    }
}

/*
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

}*/
