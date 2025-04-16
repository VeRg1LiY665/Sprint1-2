import {ObjectId} from "mongodb";
import {CommentModel} from "../db/mongoDB";
import {CommentOutputType} from "../IO Types/CommentOutputType";
import {CommentDBType} from "../Data Types/CommentDBType";
import {injectable} from "inversify";

@injectable()
export class CommentsQRepo{
    async ShowCommentsForPost(dto:{
        pageNumber:number,
        pageSize:number,
        sortBy: string,
        sortDirection:number,
        postId :string}) : Promise<CommentOutputType[]> {

        const _postID = new ObjectId(dto.postId)

        const comments = await CommentModel
            .find({postID: _postID})
            .sort({[dto.sortBy] : dto.sortDirection===1 ? 1 :-1})
            .skip((dto.pageNumber - 1) * dto.pageSize)
            .limit(dto.pageSize)
            .lean()

        if (comments.length === 0) {}
        return comments.map(el=> (this.mapToOutput(el)))
    }

    async ShowCommentByID(id: string):Promise<CommentOutputType | null> {
        const _id = new ObjectId(id)
        const comment = await CommentModel.findOne({_id: _id}).lean();
        if (comment===null) {
            return null
        }
        return this.mapToOutput(comment)
    }

    async CommentsCounter(postId:string):Promise<number>{
        let filter:any={postID : new ObjectId(postId)};

        return await CommentModel.countDocuments(filter)
    }

    mapToOutput(comment: CommentDBType): CommentOutputType {
        let MappedComment:any = {id : (comment._id).toString(), ...comment}
        delete MappedComment._id
        delete MappedComment.postID
        delete MappedComment.__v
        return MappedComment as CommentOutputType
    }

    PaginationMap(dto:{
        pageNumber:number,
        pageSize:number,
        commentsCount:number,
        comments: CommentOutputType[]
    } ) {
        return {
            pagesCount: Math.ceil(dto.commentsCount / dto.pageSize),
            page: dto.pageNumber,
            pageSize: dto.pageSize,
            totalCount: dto.commentsCount,
            items: dto.comments
        }
    }
}

