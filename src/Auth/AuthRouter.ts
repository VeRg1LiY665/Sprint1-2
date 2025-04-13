import {Router} from "express";
import {AuthController} from "./AuthController";
import {passwordRecoveryValidation, UserLoginOrEmailValidation} from "./Middlewares/AuthMiddlewares";
import {accessTokenGuard} from "./guards/AccesTokenGuard";
import {UserEmailValidation, UserLoginValidation, UserPasswordValidation} from "../Modules/Users/UsersMiddlewares";
import {ErrorCollectionMiddleware} from "../helpers/InputValidation";
import {rateLimiter} from "./Middlewares/RateLimiterMiddleware";
import {container} from "../composition-root";


export const authRouter = Router()
const authController = container.get(AuthController);

authRouter.post('/registration',
    rateLimiter,
    UserLoginValidation,
    UserPasswordValidation,
    UserEmailValidation,
    ErrorCollectionMiddleware,
    authController.register.bind(authController))

authRouter.post('/registration-confirmation',
    rateLimiter,
    authController.confirmEmail.bind(authController))

authRouter.post('/registration-email-resending',
    rateLimiter,
    UserEmailValidation,
    ErrorCollectionMiddleware,
    authController.resendEmail.bind(authController))

authRouter.post('/login',
    rateLimiter,
    UserLoginOrEmailValidation,
    UserPasswordValidation,
    ErrorCollectionMiddleware,
    authController.login.bind(authController))

authRouter.post('/refresh-token',
    authController.refreshToken.bind(authController))

authRouter.get('/me',
    accessTokenGuard,
    authController.info.bind(authController))

authRouter.post('/password-recovery',
    rateLimiter,
    UserEmailValidation,
    ErrorCollectionMiddleware,
    authController.passwordRecovery.bind(authController))

authRouter.post('/new-password',
    rateLimiter,
    passwordRecoveryValidation,
    ErrorCollectionMiddleware,
    authController.newPassword.bind(authController))

authRouter.post('/logout',
    authController.logout.bind(authController))