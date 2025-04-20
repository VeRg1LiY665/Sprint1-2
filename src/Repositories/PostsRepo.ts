import {InputPostType} from "../IO Types/InputPostType";
import {CommentModel, PostModel} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import {PostDBType} from "../Data Types/PostDBType";
import {injectable} from "inversify";
import {CommentDBType} from "../Data Types/CommentDBType";

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
        await PostModel.insertOne(content)

    }

    async ChangePost (id: string, content:InputPostType) {

        const res = await PostModel.updateOne(
            {_id:new ObjectId(id)},
            {$set:{...content}}
        )
        return res.matchedCount===1
    }

    async ChangePostReactionCount(post:PostDBType) {
        const res = await PostModel.updateOne(
            {_id: post._id},
            {$set:{...post}}
        )
        return res.matchedCount === 1;
    }
}


