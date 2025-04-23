import {injectable} from "inversify";
import {LikesRepo} from "../LikesRepo/LikesRepo";
import {CommentsRepo} from "../../../Repositories/CommentsRepo";
import {NotFoundError} from "../../../helpers/ErrorHandler";
import {LikesDBType} from "../../../Data Types/LikesDBType";
import {ObjectId} from "mongodb";
import {PostsRepo} from "../../../Repositories/PostsRepo";
import {NewestLike} from "../../../Data Types/PostDBType";
import {UsersRepo} from "../../../Repositories/UsersRepo";

@injectable()
export class LikesServices {
    constructor (
protected likesRepo:LikesRepo,
protected commentsRepo:CommentsRepo,
protected postsRepo:PostsRepo,
protected usersRepo:UsersRepo,
    ){}

    async CreateReactionForComment(dto: {commentId:string, parentId:string, likeStatus:string}):Promise<void> {
    const comment = await this.commentsRepo.ShowCommentByID(dto.commentId);
    if(!comment)
        {throw new NotFoundError('Comment not found')}

    const reaction = await this.likesRepo.ShowReactionForComment(comment.commentatorInfo.userId.toString(), dto.parentId, comment._id.toString());  //TODO убрать userId - он там не нужен
    if(!reaction){
        const newReaction = new LikesDBType (
            new ObjectId(),
            dto.likeStatus,
            comment.commentatorInfo.userId.toString(),
            dto.parentId,
            comment._id.toString(),
            '',
            new Date().toString(),
        )

        await this.likesRepo.CreateLikeEntity(newReaction)
    }
    else {
        reaction.status = dto.likeStatus
        await this.likesRepo.UpdateLikeEntity(reaction)
    }

    const {likes, dislikes} = await this.likesRepo.CountReactionsForComment(comment.commentatorInfo.userId.toString(), dto.parentId, comment._id.toString());

    comment.likesInfo.likesCount = likes
    comment.likesInfo.dislikesCount = dislikes

    await this.commentsRepo.ChangeCommentReactionCount(comment)
        return
    }

    async CreateReactionForPost(dto: {postId:string, parentId:string, likeStatus:string}):Promise<void> {
        const post = await this.postsRepo.ShowPostByID(dto.postId);
        if(!post)
        {throw new NotFoundError('Post not found')}

        const reaction = await this.likesRepo.ShowReactionForPost(dto.parentId, post._id.toString());
        if(!reaction){
            const newReaction = new LikesDBType (
                new ObjectId(),
                dto.likeStatus,
                '',     //userId в теории вообще тут не нужен
                dto.parentId,
                '',
                post._id.toString(),
                new Date().toString()
            )

            await this.likesRepo.CreateLikeEntity(newReaction)
        }
        else {
            reaction.status = dto.likeStatus
            await this.likesRepo.UpdateLikeEntity(reaction)
        }

        const lastLikes = await this.likesRepo.ShowLastReactionsForPost(post._id.toString());

        if(lastLikes) {
            const newestLikes =[]
            for (let i = 0; i<lastLikes.length; i++) {
                const user = await this.usersRepo.ShowUser(lastLikes[i].parentId)

                if (user!==null) {
                    newestLikes[i] = new NewestLike(  //TODO разобраться какого собственно хрена оно добавляет _id?
                        lastLikes[i].addedAt,
                        lastLikes[i].parentId,
                        user.login
                    )
                }
            }

            post.extendedLikesInfo.newestLikes = newestLikes;
        }

        const {likes, dislikes} = await this.likesRepo.CountReactionsForPost(post._id.toString());

        post.extendedLikesInfo.likesCount = likes
        post.extendedLikesInfo.dislikesCount = dislikes

        await this.postsRepo.ChangePostReactionCount(post)

        return
    }
}