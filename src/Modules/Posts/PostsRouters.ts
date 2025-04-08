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
    postsController.getPosts.bind(postsController))

postRouter.get('/:id',
    ObjectIdValidationMiddleware,
    postsController.getPostByID.bind(postsController))

postRouter.get('/:id/comments',
    commentsController.getComments.bind(commentsController))

postRouter.post('/',
    authMiddleware,
    PostTitleValidation,
    PostShortDescriptionValidation,
    PostContentValidation,
    ErrorCollectionMiddleware,
    postsController.createPost.bind(postsController))

postRouter.post('/:id/comments',
    accessTokenGuard,
    CommentContentValidation,
    ErrorCollectionMiddleware,
    commentsController.createComment.bind(commentsController))

postRouter.delete('/:id',
    authMiddleware,
    ObjectIdValidationMiddleware,
    postsController.deletePost.bind(postsController))

postRouter.put('/:id',
    authMiddleware,
    PostTitleValidation,
    PostShortDescriptionValidation,
    PostContentValidation,
    ErrorCollectionMiddleware,
    ObjectIdValidationMiddleware,
    postsController.updatePost.bind(postsController))