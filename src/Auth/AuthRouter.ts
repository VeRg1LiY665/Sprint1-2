import {Router} from "express";
import {authController} from "./AuthController";
import {ErrorCollectionMiddleware, UserLoginOrEmailValidation, UserPasswordValidation} from "./Middlewares/AuthMiddlewares";
import {accessTokenGuard} from "./guards/AccesTokenGuard";


export const authRouter = Router()

authRouter.post('/login',
    UserLoginOrEmailValidation,
    UserPasswordValidation,
    ErrorCollectionMiddleware,
    authController.login)

authRouter.get('/me',
    accessTokenGuard,
    authController.info)