import {Router} from "express";
import {usersController} from "./UsersController";
import {
    ObjectIdValidationMiddleware,
    UserEmailValidation,
    UserLoginValidation,
    UserPasswordValidation,
    UserQueryPageNumberValidation,
    UserQueryPageSizeValidation,
    UserQuerySortByValidation,
    UserQuerySortDirectionValidation,
} from "./UsersMiddlewares";
import {authMiddleware} from "../../Auth/BasicAuth";
import {ErrorCollectionMiddleware} from "../../helpers/InputValidation";

export const usersRouter = Router();

usersRouter.get('/',
    UserQueryPageSizeValidation,
    UserQueryPageNumberValidation,
    UserQuerySortDirectionValidation,
    UserQuerySortByValidation,
    ErrorCollectionMiddleware,
    usersController.getUsers);

usersRouter.post('/',
    authMiddleware,
    UserLoginValidation,
    UserPasswordValidation,
    UserEmailValidation,
    ErrorCollectionMiddleware,
    usersController.createUser);

usersRouter.delete('/:id',
    authMiddleware,
    ObjectIdValidationMiddleware,
    usersController.deleteUser);