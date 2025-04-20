import {PostsController} from "./PostsController";
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
import {CommentsController} from "../Comments/CommentsController";
import {accessTokenGuard} from "../../Auth/guards/AccesTokenGuard";
import {CommentContentValidation} from "../Comments/CommentsMiddlewares";
import {container} from "../../composition-root";
import {LikesController} from "../Likes/LikesController";
export const postRouter = Router();

const postsController = container.get(PostsController);
const commentsController = container.get(CommentsController);
const likesController = container.get(LikesController);

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

postRouter.put('/:id/like-status',
    accessTokenGuard,
    likesController.CreateReactionForPost.bind(likesController) )