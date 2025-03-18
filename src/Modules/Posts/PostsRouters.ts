import {postsController} from "./PostsController";
import {
    PostContentValidation,
    PostQueryPageNumberValidation,
    PostQueryPageSizeValidation,
    PostQuerySortByValidation,
    PostQuerySortDirectionValidation,
    PostShortDescriptionValidation,
    PostTitleValidation
} from "./PostsMiddlewares";

import {Router} from "express";
import {authMiddleware} from "../../Auth/Middlewares/BasicAuth";
import {ObjectIdValidationMiddleware} from "../Blogs/BlogsMiddlewares";
import {ErrorCollectionMiddleware} from "../../helpers/InputValidation";
import {commentsController} from "../Comments/CommentsController";
import {accessTokenGuard} from "../../Auth/guards/AccesTokenGuard";
import {CommentContentValidation} from "../Comments/CommentsMiddlewares";
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

postRouter.get('/:id/comments',
    commentsController.getComments)

postRouter.post('/',
    authMiddleware,
    PostTitleValidation,
    PostShortDescriptionValidation,
    PostContentValidation,
    ErrorCollectionMiddleware,
    postsController.createPost)

postRouter.post('/:id/comments',
    accessTokenGuard,
    CommentContentValidation,
    ErrorCollectionMiddleware,
    commentsController.createComment)

postRouter.delete('/:id',
    authMiddleware,
    ObjectIdValidationMiddleware,
    postsController.deletePost)

postRouter.put('/:id',
    authMiddleware,
    PostTitleValidation,
    PostShortDescriptionValidation,
    PostContentValidation,
    ErrorCollectionMiddleware,
    ObjectIdValidationMiddleware,
    postsController.updatePost)