import {Request, Response, Router} from 'express'
import {db} from '../db/db'
import {PostDBType} from "../Data Types/PostDBType";
import {BlogsRepo} from "../Repositories/BlogsRepo";
import {PostRepo} from "../Repositories/PostsRepo";

export const postRouter = Router();

const postsController= {
    getPosts: (req: Request, res: Response) => {
        res.status(200).json(PostRepo.ShowAllPosts())
    },

    getPostByID: (req: Request, res: Response) => {
        const result = PostRepo.ShowPostByID(req.params.id)
        if (!result) {
            res.status(404).json('Error: post not found')
            return
        }

        res.status(200).json(result)
    },

    deletePost: (req: Request, res: Response) => {
        (PostRepo.DeletePost(req.params.id)) ? res.sendStatus(204) : res.status(404).json('Error: post not found')
    },

    createPost: (req: Request, res: Response) => {
            res.status(201).json(PostRepo.SetUpNewPost(req.body));
            return
    },

    updatePost: (req: Request, res: Response) => {
        const AlterFlag = PostRepo.ChangePost(req.params.id, req.body);
        (AlterFlag) ? res.status(204).json('Succesful update'): res.status(404).json('Not found');
    }
}



postRouter.get('/', postsController.getPosts)
postRouter.get('/:id', postsController.getPostByID)
postRouter.post('/', postsController.createPost)
postRouter.delete('/:id', postsController.deletePost)
postRouter.put('/:id', postsController.updatePost)