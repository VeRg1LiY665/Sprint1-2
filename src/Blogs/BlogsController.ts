import {Request, Response} from 'express';
import {BlogsRepo} from "../Repositories/BlogsRepo";

export const blogsController= {
    getBlogs: async (req: Request, res: Response) => {
        const AllBlogs = await BlogsRepo.ShowAllBlogs()
        res.status(200).json(AllBlogs)
    },

    getBlogByID: async (req: Request, res: Response) => {
       const result = await BlogsRepo.ShowBlogByID(req.params.id)
        if (!result) {
            res.status(404).json('Error: blog not found')
            return
        }
        res.status(200).json(result)
    },

    deleteBlog: async (req: Request, res: Response) => {
       (await BlogsRepo.DeleteBlog(req.params.id)) ? res.sendStatus(204) : res.status(404).json('Error: blog not found')
    },

    createBlog: async (req: Request, res: Response) => {
            res.status(201).json(await BlogsRepo.SetUpNewBlog(req.body));
            return
    },

    updateBlog: async (req: Request, res: Response) => {
        const AlterFlag = await BlogsRepo.ChangeBlog(req.params.id, req.body);
       (AlterFlag) ? res.status(204).json('Successful update'): res.status(404).json('Error: blog not found');
        }
    }

