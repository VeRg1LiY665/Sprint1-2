import {postsController} from "./PostsController";
import {
    BlogIdValidation,
    InputValidationMiddleware,
    PostContentValidation,
    PostShortDescriptionValidation,
    PostTitleValidation
} from "./PostsMiddlewares";

import {Router} from "express";
import {authMiddleware} from "../Auth/BasicAuth";
export const postRouter = Router();

postRouter.get('/', postsController.getPosts)

postRouter.get('/:id', postsController.getPostByID)

postRouter.post('/', authMiddleware, PostTitleValidation, PostShortDescriptionValidation, PostContentValidation, BlogIdValidation, InputValidationMiddleware, postsController.createPost)

postRouter.delete('/:id', authMiddleware, postsController.deletePost)

postRouter.put('/:id', authMiddleware, PostTitleValidation, PostShortDescriptionValidation, PostContentValidation, BlogIdValidation, InputValidationMiddleware, postsController.updatePost)