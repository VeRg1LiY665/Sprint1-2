import {postsController} from "./PostsController";
import {
    BlogIdValidation,
    BlogIdValidationMiddleware,
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
import {ErrorCollectionMiddleware} from "../../helpers/InputValidation";
export const postRouter = Router();

postRouter.get('/',
    PostQueryPageNumberValidation,
    PostQueryPageSizeValidation,
    PostQuerySortByValidation,
    PostQuerySortDirectionValidation,
    ErrorCollectionMiddleware,
    postsController.getPosts)

postRouter.get('/:id',
    ObjectIdValidationMiddleware,
    postsController.getPostByID)

postRouter.post('/',
    authMiddleware,
    PostTitleValidation,
    PostShortDescriptionValidation,
    PostContentValidation,
    BlogIdValidation,
    ErrorCollectionMiddleware,
    postsController.createPost)

postRouter.delete('/:id',
    authMiddleware,
    ObjectIdValidationMiddleware,
    postsController.deletePost)

postRouter.put('/:id',
    authMiddleware,
    PostTitleValidation,
    PostShortDescriptionValidation,
    PostContentValidation,
    BlogIdValidation,
    ErrorCollectionMiddleware,
    ObjectIdValidationMiddleware,
    postsController.updatePost)