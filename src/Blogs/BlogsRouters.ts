import {blogsController} from "./BlogsController";
import {
    BlogDescriptionValidation,
    BlogNameValidation,
    BlogUrlLengthValidation,
    BlogUrlValidation,
    ErrorCollectionMiddleware, ObjectIdValidationMiddleware
} from "./BlogsMiddlewares";
import {Router} from "express";
import {authMiddleware} from "../Auth/BasicAuth";
import {postsController} from "../Posts/PostsController";

export const blogRouter = Router();

blogRouter.get('/', blogsController.getBlogs)

blogRouter.get('/:id',ObjectIdValidationMiddleware, blogsController.getBlogByID)

blogRouter.get('/id/posts', blogsController.getPostsForBlog)

blogRouter.post('/id/posts',authMiddleware, postsController.createPost)

blogRouter.post('/',authMiddleware, BlogNameValidation, BlogDescriptionValidation, BlogUrlLengthValidation, BlogUrlValidation, ErrorCollectionMiddleware, blogsController.createBlog)

blogRouter.delete('/:id',authMiddleware, ObjectIdValidationMiddleware, ObjectIdValidationMiddleware, blogsController.deleteBlog)

blogRouter.put('/:id',authMiddleware, BlogNameValidation, BlogDescriptionValidation, BlogUrlLengthValidation, BlogUrlValidation, ErrorCollectionMiddleware, ObjectIdValidationMiddleware, blogsController.updateBlog)