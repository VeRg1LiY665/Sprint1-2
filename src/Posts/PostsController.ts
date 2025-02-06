import {Request, Response} from 'express'
import {PostRepo} from "../Repositories/PostsRepo";


export const postsController= {
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

