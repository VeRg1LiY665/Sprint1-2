import {Request, Response,NextFunction} from "express";
import {PostOutputType} from "../../IO Types/PostOutputType";
import {PostsQRepo} from "../../Repositories/PostsQRepo";
import {CommentsServices} from "../../Services/CommentsServices";
import {CommentsQRepo} from "../../Repositories/CommentsQRepo";
import {UserOutputType} from "../../IO Types/UserOutputType";
import {UsersQRepo} from "../../Repositories/UsersQRepo";
import {commentsPaginationQueries} from "../../helpers/pagination-values";
import {CustomError, HttpStatuses, NotFoundError} from "../../helpers/ErrorHandler";
import {jwtService} from "../../Auth/Services/JwtService";


export const commentsController= {
    getComments: async (req: Request, res: Response,  next:NextFunction) => {
        try {
            const foundPost = await PostsQRepo.ShowPostByID(req.params.id);
            if (foundPost===null) {throw new NotFoundError('Post not found')}

            const {pageNumber, pageSize, sortBy, sortDirection, postId} = commentsPaginationQueries(req)

            const comments = await CommentsQRepo.ShowCommentsForPost({
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
                postId
            })
            const commentsCount = await CommentsQRepo.CommentsCounter(postId)
            const result = CommentsQRepo.PaginationMap({pageNumber, pageSize, commentsCount, comments})
            res.status(200).json(result)
        }
        catch(err){next(err)}
    },

    getCommentByID: async (req: Request, res: Response, next:NextFunction) => {
        try {
            const result = await CommentsQRepo.ShowCommentByID(req.params.id)
            if (result === null) {
                throw new NotFoundError('Comment not found')
            }
            res.status(200).json(result)
        }
        catch (err) {next(err)}
    },

    deleteComment: async (req: Request, res: Response, next:NextFunction) => {
       try {
           if (!await CommentsServices.DeleteComment(req.params.id, res.locals.user.userId)) {
               throw new CustomError('Unexpected exception', HttpStatuses.BadRequest, [{
                   message: 'No delete happened in repo',
                   field: 'null'
               }])
           }
           res.status(204).json()
       }
       catch (err) {next(err)}
       },

    createComment: async (req: Request, res: Response, next:NextFunction) => {
        try {const foundPost: PostOutputType|null = await PostsQRepo.ShowPostByID(req.params.id)
            if (!foundPost) {throw new NotFoundError('Post not found')}

        const foundUser: UserOutputType|null = await UsersQRepo.ShowUserByID(res.locals.user.userId)
            if (!foundUser) {throw new NotFoundError('User not found')}

        const CreatedId = await CommentsServices.SetUpNewCommentForPost(req.body, foundPost, foundUser);
            if(!CreatedId){throw new CustomError('Unexpected exception', HttpStatuses.BadRequest, [{field:'null' , message:'No creation happened in repo'}])}

        const result = await CommentsQRepo.ShowCommentByID(CreatedId);
            if (!result) {throw new NotFoundError('Comment not found')}
            res.status(201).json(result)
            }

        catch (err) {next(err)}
    },

    updateComment: async (req: Request, res: Response, next:NextFunction) => {
        try {
            const AlterFlag = await CommentsServices.UpdateComment(req.params.id, res.locals.user.userId, req.body);
            if (!AlterFlag)  {throw new CustomError('Unexpected exception', HttpStatuses.BadRequest, [{message:'No update happened in repo', field:'null'}])}
            res.status(204).json('Successful update')
        }
        catch (err) {next(err)}
        }
}