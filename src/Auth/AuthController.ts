import {Request, Response, NextFunction} from 'express';
import {AuthServices} from "./Services/AuthService";
import {HttpStatuses} from "../helpers/ErrorHandler";
import {UsersQRepo} from "../Repositories/UsersQRepo";
import {RegServices} from "./Services/RegService";
import {jwtService} from "./Services/JwtService";
import {DeviceData} from "../helpers/SessionDataValues";

export const authController = {
    register: async (req: Request, res: Response, next: NextFunction) => {
    try{
        await RegServices.RegisterUser(req.body);
        res.sendStatus(204)
    }
        catch(err){next(err)}
    },

    confirmEmail: async (req: Request, res: Response, next: NextFunction) => {
    try{
        await RegServices.ConfirmEmail(req.body)
        res.sendStatus(204)
    }
        catch(err){next(err)}
    },

    resendEmail: async (req: Request, res: Response, next: NextFunction) => {
    try {
        await RegServices.ResendEmail(req.body)
        res.sendStatus(204)
    }
    catch(err){next(err)}
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {loginOrEmail, password, ip, title} = DeviceData(req)
            const {refreshToken, accessToken} = await AuthServices.LoginUser({loginOrEmail, password, ip, title});
            /*if (!accessToken) {throw new CustomError("Invalid access token",
                HttpStatuses.NoContent,
                [{ message:'access Token = '+accessToken, field:'null'}]);}
            if (!refreshToken) {throw new CustomError("Invalid refresh token",
                HttpStatuses.NoContent,
                [{ message:'refresh Token = '+refreshToken, field:'null'}]);}*/ //Тоже ненужные проверки, убрать их
            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
            res.status(200).json({accessToken:accessToken});
        } catch (err) {
            next(err)
        }
    },

    refreshToken: async (req: Request, res: Response, next: NextFunction) => {
        try{
            const {newRToken, newAToken} = await AuthServices.refreshAccessToken(req.cookies.refreshToken);

            res.cookie('refreshToken', newRToken, {httpOnly: true, secure: true,})
            res.status(200).send({accessToken:newAToken})
        }
        catch(err){next(err)}
    },

    info: async (req: Request, res: Response): Promise<any> => {

        const userId = res.locals.user.userId as string;

        if (!userId) return res.sendStatus(HttpStatuses.Unauthorized)

        const me = await UsersQRepo.ShowUserByID(userId);
        if (!me) {
            return res.sendStatus(HttpStatuses.NotFound)
        } else {
            const result = {
                userId: me.id,
                login: me.login,
                email: me.email
            }
            return res.status(HttpStatuses.Success).send(result);
        }
    },

    passwordRecovery: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await AuthServices.passwordRecovery(req.body)
            res.sendStatus(HttpStatuses.NoContent) //По тз, если входную валидацию прошли - кидаем 204 в любом случае
        }
        catch(err){next(err)}
    },

    newPassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await AuthServices.newPassword(req.body)

            res.sendStatus(HttpStatuses.Success)
        }
        catch(err){next(err)}
    },

    logout: async (req: Request, res: Response, next: NextFunction) => {
    try{
        await AuthServices.LogoutUser(req.cookies.refreshToken)
        res.sendStatus(204)
    }
    catch(err){next(err)}
        }
}
