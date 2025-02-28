import {Request, Response} from 'express';
import {BlogsQRepo} from "../../Repositories/BlogsQRepo";
import {BlogsServices} from "../../Services/BlogsServices";
import {paginationQueries} from "../../helpers/pagination-values";

export const blogsController= {
    getBlogs: async (req: Request, res: Response) => {
        const {pageNumber, pageSize, sortBy, sortDirection, searchNameTerm} = paginationQueries(req)
        const blogs = await BlogsQRepo.ShowAllBlogs({pageNumber, pageSize, sortBy, sortDirection, searchNameTerm})
        const blogsCount = await BlogsQRepo.BlogsCounter(searchNameTerm)
        const result = BlogsQRepo.PaginationMap({pageNumber, pageSize, blogsCount, blogs})
        res.status(200).json(result)
    },

    getBlogByID: async (req: Request, res: Response) => {
        const result = await BlogsQRepo.ShowBlogByID(req.params.id)
        if (result === null) {
            res.status(404).json( 'Error: blog not found')
            return
        }
        res.status(200).json(result)
    },

    deleteBlog: async (req: Request, res: Response) => {
       (await BlogsServices.DeleteBlog(req.params.id)) ? res.sendStatus(204) : res.status(404).json('Error: blog not found')
    },

    createBlog: async (req: Request, res: Response) => {
        const id = await BlogsServices.SetUpNewBlog(req.body)
        const result = await BlogsQRepo.ShowBlogByID(id);
        (result) ? res.status(201).json(result) : res.status(400).json('Error: blog was not created');
    },

    updateBlog: async (req: Request, res: Response) => {
        const AlterFlag = await BlogsServices.UpdateBlog(req.params.id, req.body);
       (AlterFlag) ? res.status(204).json('Successful update'): res.status(404).json('Error: blog not found');
        }
    }

