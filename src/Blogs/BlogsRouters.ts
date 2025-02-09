import {blogsController} from "./BlogsController";
import {
    BlogDescriptionValidation,
    BlogNameValidation,
    BlogUrlLengthValidation,
    BlogUrlValidation,
    ErrorCollectionMiddleware
} from "./BlogsMiddlewares";
import {Router} from "express";
import {authMiddleware} from "../Auth/BasicAuth";

export const blogRouter = Router();

blogRouter.get('/', blogsController.getBlogs)

blogRouter.get('/:id', blogsController.getBlogByID)

blogRouter.post('/',authMiddleware, BlogNameValidation, BlogDescriptionValidation, BlogUrlLengthValidation, BlogUrlValidation, ErrorCollectionMiddleware, blogsController.createBlog)

blogRouter.delete('/:id',authMiddleware, blogsController.deleteBlog)

blogRouter.put('/:id',authMiddleware, BlogNameValidation, BlogDescriptionValidation, BlogUrlLengthValidation, BlogUrlValidation, ErrorCollectionMiddleware, blogsController.updateBlog)