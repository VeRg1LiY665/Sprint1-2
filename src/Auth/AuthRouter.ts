import {Router} from "express";
import {authController} from "./AuthController";
import {ErrorCollectionMiddleware, UserLoginOrEmailValidation, UserPasswordValidation} from "./AuthMiddlewares";


export const authRouter = Router()

authRouter.post('/login',
    UserLoginOrEmailValidation,
    UserPasswordValidation,
    ErrorCollectionMiddleware,
    authController.login)