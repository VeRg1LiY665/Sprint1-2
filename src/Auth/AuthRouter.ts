import {Router} from "express";
import {authController} from "./AuthController";
import {UserLoginOrEmailValidation} from "./Middlewares/AuthMiddlewares";
import {accessTokenGuard} from "./guards/AccesTokenGuard";
import {UserEmailValidation, UserLoginValidation, UserPasswordValidation} from "../Modules/Users/UsersMiddlewares";
import {ErrorCollectionMiddleware} from "../helpers/InputValidation";


export const authRouter = Router()

authRouter.post('/registration',
    UserLoginValidation,
    UserPasswordValidation,
    UserEmailValidation,
    ErrorCollectionMiddleware,
    authController.register)

authRouter.post('/registration-confirmation',
    authController.confirmEmail)

authRouter.post('/registration-email-resending',
    UserEmailValidation,
    ErrorCollectionMiddleware,
    authController.resendEmail)

authRouter.post('/login',
    UserLoginOrEmailValidation,
    UserPasswordValidation,
    ErrorCollectionMiddleware,
    authController.login)

authRouter.get('/me',
    accessTokenGuard,
    authController.info)