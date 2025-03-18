import {InputCommentType} from "../IO Types/InputCommentType";
import {PostOutputType} from "../IO Types/PostOutputType";
import {ObjectId} from "mongodb";
import {CommentDBType} from "../Data Types/CommentDBType";
import {UserOutputType} from "../IO Types/UserOutputType";
import {CommentsRepo} from "../Repositories/CommentsRepo";
import {ForbiddenError, NotFoundError} from "../helpers/ErrorHandler";

export const CommentsServices = {
    async SetUpNewCommentForPost(content: InputCommentType, foundPost:PostOutputType, foundUser:UserOutputType){

        const comment = {
            ...content,
            _id: new ObjectId(),
            commentatorInfo: {
                userId:new ObjectId(foundUser.id),
                userLogin:foundUser.login,
            },
            postID: new ObjectId(foundPost.id),
            createdAt: new Date().toISOString(),
        } as CommentDBType

        try {await CommentsRepo.SetUpNewComment(comment)}
        catch (e) {
            console.error(e)
            return null}

        return comment._id.toString()
    },

    async DeleteComment (id:string, userId: string) { //нужна проверка что удаляем свой коммент
        const comment = await CommentsRepo.ShowCommentByID(id)
        if (comment===null) {throw new NotFoundError('Comment not found')}
        if (userId!==comment.commentatorInfo.userId.toString()){throw new ForbiddenError('Access denied')}
        return await CommentsRepo.DeleteComment(id)
    },

    async UpdateComment(id:string, userId: string, content:InputCommentType){//нужна проверка что удаляем свой коммент
        const comment = await CommentsRepo.ShowCommentByID(id)
        if (comment===null) {throw new NotFoundError('Comment not found')}
        if (userId!==comment.commentatorInfo.userId.toString()){throw new ForbiddenError('Access denied')}
        return await CommentsRepo.ChangeComment(id, content)
    }
}