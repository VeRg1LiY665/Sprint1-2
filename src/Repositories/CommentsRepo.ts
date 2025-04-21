import {CommentModel} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import {InputCommentType} from "../IO Types/InputCommentType";
import {CommentDBType} from "../Data Types/CommentDBType";
import {injectable} from "inversify";

@injectable()
export class CommentsRepo {
    async ShowCommentByID(id:string, ){
        const result = await CommentModel
            .findOne({_id:new ObjectId(id)})
            .lean()
        return result
    }

    async DeleteComment (id:string) {
        const res = await CommentModel.deleteOne({_id : new ObjectId(id)})
        return res.deletedCount === 1;
    }

    async SetUpNewComment(comment:CommentDBType) {

        const res = await CommentModel.insertOne(comment)
        return res._id.toString();
    }

    async ChangeComment (id: string, content:InputCommentType) {
        const res = await CommentModel.updateOne(
            {_id: new ObjectId(id)},
            {$set:{...content}}
        )
        return res.matchedCount === 1;
    }

    async ChangeCommentReactionCount(comment:CommentDBType) {
        const res = await CommentModel.updateOne(
            {_id: comment._id},
            {$set:{...comment}}
        )
        return res.matchedCount === 1;
    }
}

