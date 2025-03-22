import {NextFunction, Request, Response} from 'express'
import {PostsQRepo} from "../../Repositories/PostsQRepo";
import {PostsServices} from "../../Services/PostsServices";
import {paginationQueries} from "../../helpers/pagination-values";
import {BlogsQRepo} from "../../Repositories/BlogsQRepo";
import {BlogOutputType} from "../../IO Types/BlogOutputType";
import {CustomError, HttpStatuses, NotFoundError} from "../../helpers/ErrorHandler";


export const postsController= {
    getPosts: async (req: Request, res: Response) => {
        const {pageNumber, pageSize, sortBy, sortDirection, searchNameTerm} = paginationQueries(req)
        const posts = await PostsQRepo.ShowAllPosts({pageNumber, pageSize, sortBy, sortDirection, searchNameTerm})
        const postsCount = await BlogsQRepo.BlogsCounter(searchNameTerm)
        const result = PostsQRepo.PaginationMap({pageNumber, pageSize, postsCount, posts})
        res.status(200).json(result)
    },

    getPostByID: async (req: Request, res: Response, next:NextFunction) => {
        try {
            const result = await PostsQRepo.ShowPostByID(req.params.id)

            if (result === null) {
                throw new NotFoundError("Post not Found");
            }
            else {
                res.status(200).json(result)
            }
        }
        catch (err) {next(err)}
    },

    getPostsForBlog: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {pageNumber, pageSize, sortBy, sortDirection, searchNameTerm} = paginationQueries(req)
            const FoundBlog = await BlogsQRepo.ShowBlogByID(req.params.id);

            if (FoundBlog === null) {
                throw new NotFoundError("Blog not Found");
            } else {
                const posts = await PostsQRepo.ShowPostsForBlog({
                    pageNumber,
                    pageSize,
                    sortBy,
                    sortDirection,
                    searchNameTerm,
                    blogId: FoundBlog.id
                })

                if (posts === null) {
                    throw new NotFoundError("Post not Found");
                } else {
                    const postsCount = await PostsQRepo.PostsCounter(searchNameTerm, FoundBlog.id)
                    res.status(200).json(PostsQRepo.PaginationMap({pageNumber, pageSize, postsCount, posts}))
                }
            }
        }
        catch (err) {next(err)}
        },

    deletePost: async (req: Request, res: Response, next:NextFunction) => {
        try {
            const DeleteFlag = await PostsServices.DeletePost(req.params.id)
            if (!DeleteFlag) {throw new CustomError('Unexpected exception', HttpStatuses.BadRequest, [{
                message: 'No delete happened in repo',
                field: 'null'
            }])}
            res.sendStatus(204)
        }
        catch (err) {next(err)}
    },

    createPost: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const CreatedId = await PostsServices.SetUpNewPost(req.body);
            if (CreatedId===null) {
                throw new CustomError('Unexpected exception', HttpStatuses.BadRequest, [{
                    message: 'No update happened in repo',
                    field: 'null'
                }])
            } else {
                const result = await PostsQRepo.ShowPostByID(CreatedId);
                if (result===null) {throw new NotFoundError("Post not Found");}
                res.status(201).json(result)
            }
        }
        catch (err) {next(err)}
    },

    createPostForBlog: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const foundBlog: BlogOutputType | null = await BlogsQRepo.ShowBlogByID(req.params.id)
            if (foundBlog===null) {throw new NotFoundError("Post not Found")}
            else {
                const CreatedId = await PostsServices.SetUpNewPostForBlog(req.body, foundBlog);
                if (!CreatedId) {
                    throw new CustomError('Unexpected exception', HttpStatuses.BadRequest, [{
                        message: 'No update happened in repo',
                        field: 'null'
                    }])
                } else {
                    const result = await PostsQRepo.ShowPostByID(CreatedId);
                   if (result===null) {throw new NotFoundError("Post not Found");}
                   res.status(201).json(result)
                }
            }
        }
        catch (err) {next(err)}
    },

    updatePost: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const AlterFlag = await PostsServices.UpdatePost(req.params.id, req.body);
            if (!AlterFlag)  {throw new CustomError('Unexpected exception', HttpStatuses.BadRequest, [{
                message: 'No update happened in repo',
                field: 'null'
            }])}
            res.status(204).json('Successful update')
        }
        catch (err) {next(err)}
    }
}

