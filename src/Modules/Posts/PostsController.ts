import {Request, Response} from 'express'
import {PostsRepo} from "../../Repositories/PostsRepo";
import {PostsQRepo} from "../../Repositories/PostsQRepo";
import {PostsServices} from "../../Services/PostsServices";
import {paginationQueries} from "../../helpers/pagination-values";


export const postsController= {
    getPosts: async (req: Request, res: Response) => {
        const {pageNumber, pageSize, sortBy, sortDirection, searchNameTerm} = paginationQueries(req)
        const posts = await PostsQRepo.ShowAllPosts({pageNumber, pageSize, sortBy, sortDirection, searchNameTerm})
        const result = PostsQRepo.PaginationMap({pageNumber, pageSize, posts})
        res.status(200).json(result)
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
        const CreatedId = await PostsServices.SetUpNewPost(req.body);

        if(!CreatedId){ res.status(400).json('Error: no post created')}
        else {
            const result = await PostsQRepo.ShowPostByID(CreatedId);
            (!result) ? res.status(404).json('Error: post not found') : res.status(201).json(result)
        }
    },

    createPostForBlog: async (req: Request, res: Response) => {
        console.log(req.params.id)
        const CreatedId = await PostsServices.SetUpNewPostForBlog(req.params.id, req.body);
        if(!CreatedId){ res.status(400).json('Error: no post created')}
        else {
            const result = await PostsQRepo.ShowPostByID(CreatedId);
            (!result) ? res.status(404).json('Error: post not found') : res.status(201).json(result)
        }
    },

    updatePost: async (req: Request, res: Response) => {
        const AlterFlag = await PostsRepo.ChangePost(req.params.id, req.body);
        (AlterFlag) ? res.status(204).json('Successful update'): res.status(404).json('Error: post not found');
    }
}

