import {InputCommentType} from "../IO Types/InputCommentType";
import {PostOutputType} from "../IO Types/PostOutputType";
import {ObjectId} from "mongodb";
import {CommentDBType} from "../Data Types/CommentDBType";
import {UserOutputType} from "../IO Types/UserOutputType";
import {CommentsRepo} from "../Repositories/CommentsRepo";
import {ForbiddenError, NotFoundError} from "../helpers/ErrorHandler";
import {injectable} from "inversify";

@injectable()
export class CommentsServices {
    private commentsRepo: CommentsRepo
    constructor() {
        this.commentsRepo = new CommentsRepo();
    }
    async SetUpNewCommentForPost(content: InputCommentType, foundPost:PostOutputType, foundUser:UserOutputType){

        const comment = new CommentDBType(
            new ObjectId(),
            content.content,
            {
                userId:new ObjectId(foundUser.id),
                userLogin:foundUser.login,
            },
            new ObjectId(foundPost.id),
            new Date().toISOString()
        )

        try {await this.commentsRepo.SetUpNewComment(comment)}
        catch (e) {
            console.error(e)
            return null}

        return comment._id.toString()
    }

    async DeleteComment (id:string, userId: string) { //нужна проверка что удаляем свой коммент
        const comment = await this.commentsRepo.ShowCommentByID(id)
        if (comment===null) {throw new NotFoundError('Comment not found')}
        if (userId!==comment.commentatorInfo.userId.toString()){throw new ForbiddenError('Access denied')}
        return await this.commentsRepo.DeleteComment(id)
    }

    async UpdateComment(id:string, userId: string, content:InputCommentType){//нужна проверка что удаляем свой коммент
        const comment = await this.commentsRepo.ShowCommentByID(id)
        if (comment===null) {throw new NotFoundError('Comment not found')}
        if (userId!==comment.commentatorInfo.userId.toString()){throw new ForbiddenError('Access denied')}
        return await this.commentsRepo.ChangeComment(id, content)
    }
}

