import {Request, Response,NextFunction} from "express";
import {PostOutputType} from "../../IO Types/PostOutputType";
import {PostsQRepo} from "../../Repositories/PostsQRepo";
import {CommentsServices} from "../../Services/CommentsServices";
import {CommentsQRepo} from "../../Repositories/CommentsQRepo";
import {UserOutputType} from "../../IO Types/UserOutputType";
import {UsersQRepo} from "../../Repositories/UsersQRepo";
import {commentsPaginationQueries} from "../../helpers/pagination-values";
import {CustomError, HttpStatuses, NotFoundError} from "../../helpers/ErrorHandler";
import {injectable} from "inversify";

@injectable()
export class CommentsController {
    private commentsQRepo: CommentsQRepo;
    private commentsServices: CommentsServices;
    private postsQRepo: PostsQRepo;
    private usersQRepo: UsersQRepo;
    constructor (){
        this.commentsQRepo = new CommentsQRepo();
        this.commentsServices = new CommentsServices();
        this.postsQRepo = new PostsQRepo();
        this.usersQRepo = new UsersQRepo();
    }

    async getComments(req: Request, res: Response,  next:NextFunction) {
    try {
    const foundPost = await this.postsQRepo.ShowPostByID(req.params.id);
    if (foundPost===null) {throw new NotFoundError('Post not found')}

const {pageNumber, pageSize, sortBy, sortDirection, postId} = commentsPaginationQueries(req)

const comments = await this.commentsQRepo.ShowCommentsForPost({
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
    postId
})
const commentsCount = await this.commentsQRepo.CommentsCounter(postId)
const result = this.commentsQRepo.PaginationMap({pageNumber, pageSize, commentsCount, comments})
res.status(200).json(result)
}
catch(err){next(err)}
}

    async getCommentByID(req: Request, res: Response, next:NextFunction) {
    try {
        const result = await this.commentsQRepo.ShowCommentByID(req.params.id)
        if (result === null) {
            throw new NotFoundError('Comment not found')
        }
        res.status(200).json(result)
    }
    catch (err) {next(err)}
}

    async deleteComment(req: Request, res: Response, next:NextFunction) {
    try {
        if (!await this.commentsServices.DeleteComment(req.params.id, res.locals.user.userId)) {
            throw new CustomError('Unexpected exception', HttpStatuses.BadRequest, [{
                message: 'No delete happened in repo',
                field: 'null'
            }])
        }
        res.status(204).json()
    }
    catch (err) {next(err)}
}

    async createComment(req: Request, res: Response, next:NextFunction) {
    try {const foundPost: PostOutputType|null = await this.postsQRepo.ShowPostByID(req.params.id)
        if (!foundPost) {throw new NotFoundError('Post not found')}

        const foundUser: UserOutputType|null = await this.usersQRepo.ShowUserByID(res.locals.user.userId)
        if (!foundUser) {throw new NotFoundError('User not found')}

        const CreatedId = await this.commentsServices.SetUpNewCommentForPost(req.body, foundPost, foundUser);
        if(!CreatedId){throw new CustomError('Unexpected exception', HttpStatuses.BadRequest, [{field:'null' , message:'No creation happened in repo'}])}

        const result = await this.commentsQRepo.ShowCommentByID(CreatedId);
        if (!result) {throw new NotFoundError('Comment not found')}
        res.status(201).json(result)
    }

    catch (err) {next(err)}
}

    async updateComment(req: Request, res: Response, next:NextFunction) {
    try {
        const AlterFlag = await this.commentsServices.UpdateComment(req.params.id, res.locals.user.userId, req.body);
        if (!AlterFlag)  {throw new CustomError('Unexpected exception', HttpStatuses.BadRequest, [{message:'No update happened in repo', field:'null'}])}
        res.status(204).json('Successful update')
    }
    catch (err) {next(err)}
}

}

/*export const commentsController = new CommentsController();*/

