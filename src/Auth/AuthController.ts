import {Request, Response, NextFunction} from 'express';
import {AuthServices} from "./Services/AuthService";
import {HttpStatuses} from "../helpers/ErrorHandler";
import {UsersQRepo} from "../Repositories/UsersQRepo";
import {RegServices} from "./Services/RegService";
import {JwtService} from "./Services/JwtService";
import {DeviceData} from "../helpers/SessionDataValues";
import {injectable} from "inversify";

@injectable()
export class AuthController{
    constructor(protected regServices: RegServices,
                protected authServices: AuthServices,
                protected usersQRepo: UsersQRepo,) {}

     async register(req: Request, res: Response, next: NextFunction) {
    try{
    await this.regServices.RegisterUser(req.body);
    res.sendStatus(204)
}
catch(err){next(err)}
}

 async confirmEmail(req: Request, res: Response, next: NextFunction) {
    try{
        await this.regServices.ConfirmEmail(req.body)
        res.sendStatus(204)
    }
    catch(err){next(err)}
}

     async resendEmail(req: Request, res: Response, next: NextFunction)  {
    try {
        await this.regServices.ResendEmail(req.body)
        res.sendStatus(204)
    }
    catch(err){next(err)}
}

     async login(req: Request, res: Response, next: NextFunction)  {
    try {
        const {loginOrEmail, password, ip, title} = DeviceData(req)
        const {refreshToken, accessToken} = await this.authServices.LoginUser({loginOrEmail, password, ip, title});

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
        res.status(200).json({accessToken:accessToken});
    } catch (err) {
        next(err)
    }
}

     async refreshToken(req: Request, res: Response, next: NextFunction)  {
    try{
        const {newRToken, newAToken} = await this.authServices.refreshAccessToken(req.cookies.refreshToken);

        res.cookie('refreshToken', newRToken, {httpOnly: true, secure: true,})
        res.status(200).send({accessToken:newAToken})
    }
    catch(err){next(err)}
}

     async info(req: Request, res: Response): Promise<any>  {

    const userId = res.locals.user.userId as string;

    if (!userId) return res.sendStatus(HttpStatuses.Unauthorized)

    const me = await this.usersQRepo.ShowUserByID(userId);
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

     async passwordRecovery(req: Request, res: Response, next: NextFunction)  {
    try {
        await this.authServices.passwordRecovery(req.body.email)
        res.sendStatus(HttpStatuses.NoContent) //По тз, если входную валидацию прошли - кидаем 204 в любом случае
    }
    catch(err){next(err)}
}

     async newPassword(req: Request, res: Response, next: NextFunction)  {
    try {
        await this.authServices.newPassword(req.body)

        res.sendStatus(HttpStatuses.NoContent)
    }
    catch(err){next(err)}
}

     async logout(req: Request, res: Response, next: NextFunction)  {
    try{
        await this.authServices.LogoutUser(req.cookies.refreshToken)
        res.sendStatus(204)
    }
    catch(err){next(err)}
}
}


