import {Request, Response, NextFunction} from 'express';
import {BlogsQRepo} from "../../Repositories/BlogsQRepo";
import {BlogsServices} from "../../Services/BlogsServices";
import {paginationQueries} from "../../helpers/pagination-values";
import {CustomError, HttpStatuses, NotFoundError} from "../../helpers/ErrorHandler";

export class BlogsController {

    constructor(protected blogsServices: BlogsServices, protected blogsQRepo: BlogsQRepo) {}

    async getBlogs (req: Request, res: Response) {
    const {pageNumber, pageSize, sortBy, sortDirection, searchNameTerm} = paginationQueries(req)
    const blogs = await this.blogsQRepo.ShowAllBlogs({pageNumber, pageSize, sortBy, sortDirection, searchNameTerm})
    const blogsCount = await this.blogsQRepo.BlogsCounter(searchNameTerm)
    const result = this.blogsQRepo.PaginationMap({pageNumber, pageSize, blogsCount, blogs})
    res.status(200).json(result)
}

    async getBlogByID (req: Request, res: Response, next:NextFunction) {
    try {
        const result = await this.blogsQRepo.ShowBlogByID(req.params.id)
        if (result === null) {
            throw new NotFoundError('Blog Not Found')
        }
        res.status(200).json(result)
    }
    catch (err) {next(err)}
}

     async deleteBlog(req: Request, res: Response, next:NextFunction) {
    try {
        const foundBlog = await this.blogsQRepo.ShowBlogByID(req.params.id)
        if (foundBlog === null) {
            throw new NotFoundError('Blog Not Found')
        }
        (await this.blogsServices.DeleteBlog(req.params.id)) ? res.sendStatus(204) : res.status(404).json('Error: blog not found')
    }
    catch (err) {next(err)}
}

     async createBlog(req: Request, res: Response, next:NextFunction) {
    try {
        const id = await this.blogsServices.SetUpNewBlog(req.body)
        if (!id) {
            throw new CustomError('Unexpected exception', HttpStatuses.BadRequest, [{
                message: 'No update happened in repo',
                field: 'null'
            }])
        }
        const result = await this.blogsQRepo.ShowBlogByID(id);
        if (!result) {
            throw new CustomError('Unexpected exception', HttpStatuses.BadRequest, [{
                message: 'No update happened in repo',
                field: 'null'
            }])
        }
        res.status(201).json(result)
    }
    catch (err) {next(err)}
}

     async updateBlog(req: Request, res: Response, next:NextFunction) {
    try {
        const AlterFlag = await this.blogsServices.UpdateBlog(req.params.id, req.body);
        if (!AlterFlag) {throw new NotFoundError('Blog Not Found')}
        res.status(204).json('Successful update')
    }
    catch (err) {next(err)}
}
}

//export const blogsController = new BlogsController();

/*export const blogsController= {
    getBlogs: async (req: Request, res: Response) => {
        const {pageNumber, pageSize, sortBy, sortDirection, searchNameTerm} = paginationQueries(req)
        const blogs = await BlogsQRepo.ShowAllBlogs({pageNumber, pageSize, sortBy, sortDirection, searchNameTerm})
        const blogsCount = await BlogsQRepo.BlogsCounter(searchNameTerm)
        const result = BlogsQRepo.PaginationMap({pageNumber, pageSize, blogsCount, blogs})
        res.status(200).json(result)
    },

    getBlogByID: async (req: Request, res: Response, next:NextFunction) => {
        try {
            const result = await BlogsQRepo.ShowBlogByID(req.params.id)
            if (result === null) {
                throw new NotFoundError('Blog Not Found')
            }
            res.status(200).json(result)
        }
        catch (err) {next(err)}
    },

    deleteBlog: async (req: Request, res: Response, next:NextFunction) => {
       try {
           const foundBlog = await BlogsRepo.ShowBlogByID(req.params.id)
           if (foundBlog === null) {
               throw new NotFoundError('Blog Not Found')
           }
           (await BlogsServices.DeleteBlog(req.params.id)) ? res.sendStatus(204) : res.status(404).json('Error: blog not found')
       }
       catch (err) {next(err)}
       },

    createBlog: async (req: Request, res: Response, next:NextFunction) => {
        try {
            const id = await BlogsServices.SetUpNewBlog(req.body)
            if (!id) {
                throw new CustomError('Unexpected exception', HttpStatuses.BadRequest, [{
                    message: 'No update happened in repo',
                    field: 'null'
                }])
            }
            const result = await BlogsQRepo.ShowBlogByID(id);
            if (!result) {
                throw new CustomError('Unexpected exception', HttpStatuses.BadRequest, [{
                    message: 'No update happened in repo',
                    field: 'null'
                }])
            }
            res.status(201).json(result)
        }
        catch (err) {next(err)}
        },

    updateBlog: async (req: Request, res: Response, next:NextFunction) => {
        try {
            const AlterFlag = await BlogsServices.UpdateBlog(req.params.id, req.body);
            if (!AlterFlag) {throw new NotFoundError('Blog Not Found')}
            res.status(204).json('Successful update')
        }
        catch (err) {next(err)}
    }
    }*/ //old version with plain object

