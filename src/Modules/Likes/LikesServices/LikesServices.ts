import {injectable} from "inversify";
import {LikesRepo} from "../LikesRepo/LikesRepo";
import {CommentsRepo} from "../../../Repositories/CommentsRepo";
import {NotFoundError} from "../../../helpers/ErrorHandler";
import {LikesDBType} from "../../../Data Types/LikesDBType";
import {ObjectId} from "mongodb";

@injectable()
export class LikesServices {
    constructor (
protected likesRepo:LikesRepo,
protected commentsRepo:CommentsRepo
    ){}

    async CreateReaction(dto: {commentId:string, parentId:string, likeStatus:string}){
    const comment = await this.commentsRepo.ShowCommentByID(dto.commentId);
    if(!comment)
        {throw new NotFoundError('Comment not found')}

    const reaction = await this.likesRepo.ShowReaction(comment.commentatorInfo.userId.toString(), dto.parentId);
    if(!reaction){
        const newReaction = new LikesDBType (
            new ObjectId(),
            dto.likeStatus,
            comment.commentatorInfo.userId.toString(),
            dto.parentId
        )
        await this.likesRepo.CreateLikeEntity(newReaction)
    }
    else {
        reaction.status = dto.likeStatus
        await this.likesRepo.UpdateLikeEntity(reaction)
    }

    const {likes, dislikes} = await this.likesRepo.CountReactions(comment.commentatorInfo.userId.toString(), dto.parentId)

    comment.likesInfo.likesCount = likes
    comment.likesInfo.dislikesCount = dislikes
    await this.commentsRepo.ChangeCommentReactionCount(comment)
    }


}