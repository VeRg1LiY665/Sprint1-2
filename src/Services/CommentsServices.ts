import {InputCommentType} from "../IO Types/InputCommentType";
import {PostOutputType} from "../IO Types/PostOutputType";
import {ObjectId} from "mongodb";
import {CommentDBType} from "../Data Types/CommentDBType";
import {UserOutputType} from "../IO Types/UserOutputType";
import {CommentsRepo} from "../Repositories/CommentsRepo";
import {ForbiddenError, NotFoundError} from "../helpers/ErrorHandler";
import {injectable} from "inversify";
import {CommentsQRepo} from "../Repositories/CommentsQRepo";
import {AuthServices} from "../Auth/Services/AuthService";
import {LikesRepo} from "../Modules/Likes/LikesRepo/LikesRepo";

@injectable()
export class CommentsServices {
    constructor(
        private commentsRepo: CommentsRepo,
        private commentsQRepo: CommentsQRepo,
        private authServices: AuthServices,
        private likesRepo: LikesRepo,
    ) {}

    async SetUpNewCommentForPost(content: InputCommentType, foundPost:PostOutputType, foundUser:UserOutputType){

        const comment = new CommentDBType(
            new ObjectId(),
            content.content,
            {
                userId:new ObjectId(foundUser.id),
                userLogin:foundUser.login,
            },
            new ObjectId(foundPost.id),
            new Date().toISOString(),
            {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None'}
        )

        try {await this.commentsRepo.SetUpNewComment(comment)}
        catch (e) {
            console.error(e)
            return null}

        return comment._id.toString()
    }

    async DeleteComment (id:string, userId: string) {
        const comment = await this.commentsRepo.ShowCommentByID(id)
        if (comment===null) {throw new NotFoundError('Comment not found')}
        if (userId!==comment.commentatorInfo.userId.toString()){throw new ForbiddenError('Access denied')}
        return await this.commentsRepo.DeleteComment(id)
    }

    async UpdateComment(id:string, userId: string, content:InputCommentType){
        const comment = await this.commentsRepo.ShowCommentByID(id)
        if (comment===null) {throw new NotFoundError('Comment not found')}
        if (userId!==comment.commentatorInfo.userId.toString()){throw new ForbiddenError('Access denied')}
        return await this.commentsRepo.ChangeComment(id, content)
    }

    async GetCommentsForPost(dto:{
        pageNumber:number,
        pageSize:number,
        sortBy: string,
        sortDirection:number,
        postId:string,
        authData:string|undefined}) {

        const comments = await this.commentsQRepo.ShowCommentsForPost({
            pageNumber:dto.pageNumber,
            pageSize:dto.pageSize,
            sortBy:dto.sortBy,
            sortDirection:dto.sortDirection,
            postId:dto.postId
        })
        const commentsCount = await this.commentsQRepo.CommentsCounter(dto.postId)

        if(dto.authData) {
            const userData = await this.authServices.checkAccessToken(dto.authData)
            for (let i = 0; i<commentsCount; i++) {
                 const reaction = await this.likesRepo.ShowReaction(comments[i].commentatorInfo.userId, userData.userId.toString())
                if(reaction) {comments[i].likesInfo.myStatus = reaction.status}
            }
        }

        const result = this.commentsQRepo.PaginationMap(
            {pageNumber:dto.pageNumber,
             pageSize:dto.pageSize,
             commentsCount:commentsCount,
             comments:comments})

        return result
    }

    async GetCommentById(dto:{id:string, authData:string|undefined}) {

        const comment = await this.commentsQRepo.ShowCommentByID(dto.id)
        if (!comment) {
            throw new NotFoundError('Comment not found')
        }

        if(dto.authData) {
            const userData = await this.authServices.checkAccessToken(dto.authData)

                const reaction = await this.likesRepo.ShowReaction(comment.commentatorInfo.userId, userData.userId.toString())
                if(reaction) {comment.likesInfo.myStatus = reaction.status}
        }

        return comment
    }
}

