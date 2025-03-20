import {Request, Response, NextFunction} from 'express';
import {AuthServices} from "./Services/AuthService";
import {CustomError, HttpStatuses} from "../helpers/ErrorHandler";
import {UsersQRepo} from "../Repositories/UsersQRepo";
import {RegServices} from "./Services/RegService";

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
            const accessToken = await AuthServices.LoginUser(req.body);
            if (!accessToken) {throw new CustomError("Invalid login token", HttpStatuses.NoContent, [{field:'null', message:'Token = '+accessToken}]);}
            res.status(200).json({accessToken:accessToken});
        } catch (err) {
            next(err)
        }
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
    }
}
