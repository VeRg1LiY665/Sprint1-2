import {Request, Response, Router} from 'express'
import {db} from '../db/db'
import {BlogDBType} from "../Data Types/BlogDBType";
import {BlogsRepo} from "../Repositories/BlogsRepo";

export const blogRouter = Router();

const blogsController= {
    getBlogs: (req: Request, res: Response) => {
        res.status(200).json(BlogsRepo.ShowAllBlogs())
    },

    getBlogByID: (req: Request, res: Response) => {
       const result = BlogsRepo.ShowBlogByID(req.params.id)
        if (!result) {
            res.status(404).json('Error: blog not found')
            return
        }
        res.status(200).json(result)
    },

    deleteBlog: (req: Request, res: Response) => {
       (BlogsRepo.DeleteBlog(req.params.id)) ? res.sendStatus(204) : res.status(404).json('Error: blog not found')
    },

    createBlog: (req: Request, res: Response) => {



            res.status(201).json(BlogsRepo.SetUpNewBlog(req.body));
            return


    },

    updateBlog: (req: Request, res: Response) => {
       const AlterFlag = BlogsRepo.ChangeBlog(req.params.id, req.body);
       (AlterFlag) ? res.status(204).json('Succesful update'): res.status(404).json('Not found');
        }

    }




blogRouter.get('/', blogsController.getBlogs)
blogRouter.get('/:id', blogsController.getBlogByID)
blogRouter.post('/', blogsController.createBlog)
blogRouter.delete('/:id', blogsController.deleteBlog)
blogRouter.put('/:id', blogsController.updateBlog)