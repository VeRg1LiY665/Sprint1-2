import {Router} from "express";
import {authController} from "./AuthController";
import {UserLoginOrEmailValidation} from "./Middlewares/AuthMiddlewares";
import {accessTokenGuard} from "./guards/AccesTokenGuard";
import {UserEmailValidation, UserLoginValidation, UserPasswordValidation} from "../Modules/Users/UsersMiddlewares";
import {ErrorCollectionMiddleware} from "../helpers/InputValidation";
import {rateLimiter} from "./Middlewares/RateLimiterMiddleware";


export const authRouter = Router()

authRouter.post('/registration',
    rateLimiter,
    UserLoginValidation,
    UserPasswordValidation,
    UserEmailValidation,
    ErrorCollectionMiddleware,
    authController.register)

authRouter.post('/registration-confirmation',
    rateLimiter,
    authController.confirmEmail)

authRouter.post('/registration-email-resending',
    rateLimiter,
    UserEmailValidation,
    ErrorCollectionMiddleware,
    authController.resendEmail)

authRouter.post('/login',
    rateLimiter,
    UserLoginOrEmailValidation,
    UserPasswordValidation,
    ErrorCollectionMiddleware,
    authController.login)

authRouter.post('/refresh-token',
    authController.refreshToken)

authRouter.get('/me',
    accessTokenGuard,
    authController.info)

authRouter.post('/logout',
    authController.logout)