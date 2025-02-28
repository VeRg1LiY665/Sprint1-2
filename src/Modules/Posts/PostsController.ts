import {Request, Response} from 'express'
import {PostsQRepo} from "../../Repositories/PostsQRepo";
import {PostsServices} from "../../Services/PostsServices";
import {paginationQueries} from "../../helpers/pagination-values";
import {BlogsQRepo} from "../../Repositories/BlogsQRepo";
import {BlogOutputType} from "../../IO Types/BlogOutputType";


export const postsController= {
    getPosts: async (req: Request, res: Response) => {
        const {pageNumber, pageSize, sortBy, sortDirection, searchNameTerm} = paginationQueries(req)
        const posts = await PostsQRepo.ShowAllPosts({pageNumber, pageSize, sortBy, sortDirection, searchNameTerm})
        const postsCount = await BlogsQRepo.BlogsCounter(searchNameTerm)
        const result = PostsQRepo.PaginationMap({pageNumber, pageSize, postsCount, posts})
        res.status(200).json(result)
    },

    getPostByID: async (req: Request, res: Response) => {
        const result = await PostsQRepo.ShowPostByID(req.params.id)
        if (result===null) {
            res.status(404).json('Error: post not found')
        }
        else {res.status(200).json(result)}
    },

    getPostsForBlog: async (req: Request, res: Response) => {
        const {pageNumber, pageSize, sortBy, sortDirection, searchNameTerm} = paginationQueries(req)
        const FoundBlog = await BlogsQRepo.ShowBlogByID(req.params.id);

        if (FoundBlog===null) {res.status(404).json('Error: blog not found')}
        else {const posts = await PostsQRepo.ShowPostsForBlog({pageNumber, pageSize, sortBy, sortDirection, searchNameTerm, blogId:FoundBlog.id})

            if (posts===null) {res.status(404).json('Posts for given blog not found')}
              else{
                const postsCount = await PostsQRepo.PostsCounter(searchNameTerm,FoundBlog.id)
                res.status(200).json(PostsQRepo.PaginationMap({pageNumber, pageSize,postsCount, posts}))}
        }
        },

    deletePost: async (req: Request, res: Response) => {
        (await PostsServices.DeletePost(req.params.id)) ? res.sendStatus(204) : res.status(404).json('Error: post not found')
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
        const foundBlog:BlogOutputType|null = await BlogsQRepo.ShowBlogByID(req.params.id)
        if (!foundBlog) {res.status(404).json('Error: blog not found')}
        else{
        const CreatedId = await PostsServices.SetUpNewPostForBlog(req.body, foundBlog);
        if(!CreatedId){ res.status(400).json('Error: no post created')}
        else {
            const result = await PostsQRepo.ShowPostByID(CreatedId);
            (!result) ? res.status(404).json('Error: post not found') : res.status(201).json(result)
        }}
    },

    updatePost: async (req: Request, res: Response) => {
        const AlterFlag = await PostsServices.UpdatePost(req.params.id, req.body);
        (AlterFlag) ? res.status(204).json('Successful update'): res.status(404).json('Error: post not found');
    }
}

