import {Router} from "express";
import {CommentsController} from "./CommentsController";
import {accessTokenGuard} from "../../Auth/guards/AccesTokenGuard";
import {CommentContentValidation, IDValidationMiddleware} from "./CommentsMiddlewares";
import {ErrorCollectionMiddleware} from "../../helpers/InputValidation";
import {container} from "../../composition-root";

export const commentsRouter = Router();
const commentsController = container.get(CommentsController);


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

