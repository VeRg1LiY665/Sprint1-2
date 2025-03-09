import {postsController} from "./PostsController";
import {
    BlogIdValidation,
    BlogIdValidationMiddleware,
    InputValidationMiddleware,
    PostContentValidation,
    PostQueryPageNumberValidation,
    PostQueryPageSizeValidation,
    PostQuerySortByValidation,
    PostQuerySortDirectionValidation,
    PostShortDescriptionValidation,
    PostTitleValidation
} from "./PostsMiddlewares";

import {Router} from "express";
import {authMiddleware} from "../../Auth/BasicAuth";
import {ObjectIdValidationMiddleware} from "../Blogs/BlogsMiddlewares";
export const postRouter = Router();

postRouter.get('/', PostQueryPageNumberValidation, PostQueryPageSizeValidation, PostQuerySortByValidation, PostQuerySortDirectionValidation,InputValidationMiddleware, postsController.getPosts)

postRouter.get('/:id', ObjectIdValidationMiddleware, postsController.getPostByID)

postRouter.post('/', authMiddleware, PostTitleValidation, PostShortDescriptionValidation, PostContentValidation, BlogIdValidation, InputValidationMiddleware, postsController.createPost)

postRouter.delete('/:id', authMiddleware, ObjectIdValidationMiddleware, postsController.deletePost)

postRouter.put('/:id', authMiddleware, PostTitleValidation, PostShortDescriptionValidation, PostContentValidation, BlogIdValidation, InputValidationMiddleware, ObjectIdValidationMiddleware, postsController.updatePost)