import {Router} from "express";
import {commentsController} from "./CommentsController";
import {accessTokenGuard} from "../../Auth/guards/AccesTokenGuard";
import {CommentContentValidation, IDValidationMiddleware} from "./CommentsMiddlewares";
import {ErrorCollectionMiddleware} from "../../helpers/InputValidation";

export const commentsRouter = Router();

commentsRouter.get('/:id',
    IDValidationMiddleware,
    commentsController.getCommentByID.bind(commentsController))

commentsRouter.delete('/:id',
    accessTokenGuard,
    IDValidationMiddleware,
    commentsController.deleteComment.bind(commentsController))

commentsRouter.put('/:id',
    accessTokenGuard,
    IDValidationMiddleware,
    CommentContentValidation,
    ErrorCollectionMiddleware,
    commentsController.updateComment.bind(commentsController))