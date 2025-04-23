import {NextFunction, Request, Response} from 'express'
import {PostsQRepo} from "../../Repositories/PostsQRepo";
import {PostsServices} from "../../Services/PostsServices";
import {paginationQueries} from "../../helpers/pagination-values";
import {BlogsQRepo} from "../../Repositories/BlogsQRepo";
import {BlogOutputType} from "../../IO Types/BlogOutputType";
import {CustomError, HttpStatuses, NotFoundError} from "../../helpers/ErrorHandler";
import {injectable} from "inversify";

@injectable()
export class PostsController {

    constructor(
        private postsQRepo: PostsQRepo,
        private blogsQRepo: BlogsQRepo,
        private postsServices: PostsServices,
    )
{}

    async getPosts(req: Request, res: Response, next:NextFunction) {

    try{
        const {pageNumber, pageSize, sortBy, sortDirection, searchNameTerm} = paginationQueries(req)

        const authData = req.headers.authorization  //для проверки авторизованности

        const posts = await this.postsServices.GetPosts({
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm,
            authData})

        res.status(200).json(posts)
    }
        catch (err) {next(err)}
    }

    async getPostByID(req: Request, res: Response, next:NextFunction) {
    try {

        const authData = req.headers.authorization
        const dto = {
            id: req.params.id,
            authData: authData
        }

        const post = await this.postsServices.GetPostById(dto)

        res.status(200).json(post)
    }
    catch (err) {next(err)}
}

    async getPostsForBlog(req: Request, res: Response, next: NextFunction) {
    try {
        const {pageNumber, pageSize, sortBy, sortDirection, searchNameTerm} = paginationQueries(req)

        const authData = req.headers.authorization

            const posts = await this.postsServices.GetPostsForBlog({
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
                searchNameTerm,
                blogId: req.params.id,
                authData: authData
            })

                res.status(200).json(posts)
            }


    catch (err) {next(err)}
}

    async deletePost(req: Request, res: Response, next:NextFunction) {
    try {
        const DeleteFlag = await this.postsServices.DeletePost(req.params.id)
        if (!DeleteFlag) {throw new CustomError('Unexpected exception', HttpStatuses.BadRequest, [{
            message: 'No delete happened in repo',
            field: 'null'
        }])}
        res.sendStatus(204)
    }
    catch (err) {next(err)}
}

    async createPost(req: Request, res: Response, next: NextFunction) {
    try {
        const CreatedId = await this.postsServices.SetUpNewPost(req.body);
        if (CreatedId===null) {
            throw new CustomError('Unexpected exception', HttpStatuses.BadRequest, [{
                message: 'No update happened in repo',
                field: 'null'
            }])
        } else {
            const result = await this.postsQRepo.ShowPostByID(CreatedId);
            if (result===null) {throw new NotFoundError("Post not Found");}
            res.status(201).json(result)
        }
    }
    catch (err) {next(err)}
}

    async createPostForBlog(req: Request, res: Response, next: NextFunction) {
    try {
        const foundBlog: BlogOutputType | null = await this.blogsQRepo.ShowBlogByID(req.params.id)
        if (foundBlog===null) {throw new NotFoundError("Post not Found")}
        else {
            const CreatedId = await this.postsServices.SetUpNewPostForBlog(req.body, foundBlog);
            if (!CreatedId) {
                throw new CustomError('Unexpected exception', HttpStatuses.BadRequest, [{
                    message: 'No update happened in repo',
                    field: 'null'
                }])
            } else {
                const result = await this.postsQRepo.ShowPostByID(CreatedId);
                if (result===null) {throw new NotFoundError("Post not Found");}
                res.status(201).json(result)
            }
        }
    }
    catch (err) {next(err)}
}

    async updatePost(req: Request, res: Response, next: NextFunction)  {
    try {
        const AlterFlag = await this.postsServices.UpdatePost(req.params.id, req.body);
        if (!AlterFlag)  {throw new CustomError('Unexpected exception', HttpStatuses.BadRequest, [{
            message: 'No update happened in repo',
            field: 'null'
        }])}
        res.status(204).json('Successful update')
    }
    catch (err) {next(err)}
}
}




