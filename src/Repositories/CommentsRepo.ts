import {blogsCollection, commentsCollection} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import {InputCommentType} from "../IO Types/InputCommentType";
import {CommentDBType} from "../Data Types/CommentDBType";
import {injectable} from "inversify";

@injectable()
export class CommentsRepo {
    async ShowCommentByID(id:string, ){
        const result = await commentsCollection.findOne({_id:new ObjectId(id)})
        return result
    }

    async DeleteComment (id:string) {
        const res = await commentsCollection.deleteOne({_id : new ObjectId(id)})
        return res.deletedCount === 1;
    }

    async SetUpNewComment(comment:CommentDBType) {

        const res = await commentsCollection.insertOne(comment)
        return res.insertedId.toString();
    }

    async ChangeComment (id: string, content:InputCommentType) {
        const res = await commentsCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set:{...content}}
        )
        return res.matchedCount === 1;
    }
}

