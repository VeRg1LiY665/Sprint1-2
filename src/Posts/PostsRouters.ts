import {postsController} from "./PostsController";
import {
    BlogIdValidation,
    InputValidationMiddleware,
    PostContentValidation,
    PostShortDescriptionValidation,
    PostTitleValidation
} from "./PostsMiddlewares";

import {Router} from "express";
export const postRouter = Router();

postRouter.get('/', postsController.getPosts)

postRouter.get('/:id', postsController.getPostByID)

postRouter.post('/', PostTitleValidation, PostShortDescriptionValidation, PostContentValidation, BlogIdValidation, InputValidationMiddleware, postsController.createPost)

postRouter.delete('/:id', postsController.deletePost)

postRouter.put('/:id', PostTitleValidation, PostShortDescriptionValidation, PostContentValidation, BlogIdValidation, InputValidationMiddleware, postsController.updatePost)