import {Request, Response} from 'express';
import {BlogsRepo} from "../Repositories/BlogsRepo";
import {BlogsQRepo} from "../Repositories/BlogsQRepo";
import {PostsRepo} from "../Repositories/PostsRepo";
import {PostsQRepo} from "../Repositories/PostsQRepo";
import {BlogsServices} from "../Services/BlogsServices";

export const blogsController= {
    getBlogs: async (req: Request, res: Response) => {
        const AllBlogs = await BlogsQRepo.ShowAllBlogs()
        res.status(200).json(AllBlogs)
    },

    getBlogByID: async (req: Request, res: Response) => {
        const result = await BlogsQRepo.ShowBlogByID(req.params.id)
        if (!result) {
            res.status(404).json( 'Error: blog not found')
            return
        }
        res.status(200).json(result)
    },

    getPostsForBlog: async (req: Request, res: Response) => {
    const result = await PostsQRepo.ShowPostsForBlog(req.params.id)

    },

   /* createPostForBlog: async (req: Request, res: Response) => {
      const result = await PostsRepo.SetUpNewPostForBlog(req.params.id)
    },*/

    deleteBlog: async (req: Request, res: Response) => {
       (await BlogsRepo.DeleteBlog(req.params.id)) ? res.sendStatus(204) : res.status(404).json('Error: blog not found')
    },

    createBlog: async (req: Request, res: Response) => {
        const id = await BlogsServices.SetUpNewBlog(req.body)
            res.status(201).json(await BlogsQRepo.ShowBlogByID(id));
            return
    },

    updateBlog: async (req: Request, res: Response) => {
        const AlterFlag = await BlogsRepo.ChangeBlog(req.params.id, req.body);
       (AlterFlag) ? res.status(204).json('Successful update'): res.status(404).json('Error: blog not found');
        }
    }

