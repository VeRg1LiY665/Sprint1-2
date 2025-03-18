import {Router} from "express";
import {commentsController} from "./CommentsController";
import {accessTokenGuard} from "../../Auth/guards/AccesTokenGuard";
import {CommentContentValidation, IDValidationMiddleware} from "./CommentsMiddlewares";
import {ErrorCollectionMiddleware} from "../../helpers/InputValidation";

export const commentsRouter = Router();

commentsRouter.get('/:id',
    IDValidationMiddleware,
    commentsController.getCommentByID)

commentsRouter.delete('/:id',
    accessTokenGuard,
    IDValidationMiddleware,
    commentsController.deleteComment)

commentsRouter.put('/:id',
    accessTokenGuard,
    IDValidationMiddleware,
    CommentContentValidation,
    ErrorCollectionMiddleware,
    commentsController.updateComment)