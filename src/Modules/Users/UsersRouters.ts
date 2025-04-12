import {Router} from "express";
import {ioc} from "../../composition-root";
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
import {authMiddleware} from "../../Auth/Middlewares/BasicAuth";
import {ErrorCollectionMiddleware} from "../../helpers/InputValidation";
import {UsersController} from "./UsersController";

export const usersRouter = Router();
const usersController = ioc.getInstance<UsersController>(UsersController)

usersRouter.get('/',
    UserQueryPageSizeValidation,
    UserQueryPageNumberValidation,
    UserQuerySortDirectionValidation,
    UserQuerySortByValidation,
    ErrorCollectionMiddleware,
    usersController.getUsers.bind(usersController));

usersRouter.post('/',
    authMiddleware,
    UserLoginValidation,
    UserPasswordValidation,
    UserEmailValidation,
    ErrorCollectionMiddleware,
    usersController.createUser.bind(usersController));

usersRouter.delete('/:id',
    authMiddleware,
    ObjectIdValidationMiddleware,
    usersController.deleteUser.bind(usersController));