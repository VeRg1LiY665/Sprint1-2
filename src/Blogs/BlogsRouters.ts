import {blogsController} from "./BlogsController";
import {
    BlogDescriptionValidation,
    BlogNameValidation,
    BlogUrlLengthValidation,
    BlogUrlValidation,
    IdValidation,
    InputValidationMiddleware
} from "./BlogsMiddlewares";
import {Router} from "express";

export const blogRouter = Router();

blogRouter.get('/', blogsController.getBlogs)

blogRouter.get('/:id', IdValidation, blogsController.getBlogByID)

blogRouter.post('/', BlogNameValidation, BlogDescriptionValidation, BlogUrlLengthValidation, BlogUrlValidation, InputValidationMiddleware, blogsController.createBlog)

blogRouter.delete('/:id', IdValidation, blogsController.deleteBlog)

blogRouter.put('/:id',BlogNameValidation, BlogDescriptionValidation, BlogUrlLengthValidation, BlogUrlValidation, IdValidation, InputValidationMiddleware, blogsController.updateBlog)