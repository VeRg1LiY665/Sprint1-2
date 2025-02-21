import {Request, Response} from 'express'
import {PostsRepo} from "../Repositories/PostsRepo";
import {PostsQRepo} from "../Repositories/PostsQRepo";


export const postsController= {
    getPosts: async (req: Request, res: Response) => {
        res.status(200).json(await PostsQRepo.ShowAllPosts())
    },

    getPostByID: async (req: Request, res: Response) => {
        const result = await PostsQRepo.ShowPostByID(req.params.id)
        if (!result) {
            res.status(404).json('Error: post not found')
            return
        }

        res.status(200).json(result)
    },

    deletePost: async (req: Request, res: Response) => {
        (await PostsRepo.DeletePost(req.params.id)) ? res.sendStatus(204) : res.status(404).json('Error: post not found')
    },

    createPost: async (req: Request, res: Response) => {
        res.status(201).json(await PostsRepo.SetUpNewPost(req.body));
            return
    },

    updatePost: async (req: Request, res: Response) => {
        const AlterFlag = await PostsRepo.ChangePost(req.params.id, req.body);
        (AlterFlag) ? res.status(204).json('Successful update'): res.status(404).json('Error: post not found');
    }
}

