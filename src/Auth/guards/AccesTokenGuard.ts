import {Request, Response, NextFunction} from "express";
import {AuthServices} from "../Services/AuthService";


export const accessTokenGuard= async (
    req: Request,
    res: Response,
    next: NextFunction
):Promise <any> => {
    if (!req.headers.authorization)
        return res.sendStatus(401);
try {
    const result = await AuthServices.checkAccessToken(req.headers.authorization);
    res.locals.user = result;
    return next();
    }

catch (err) {
   // next(err); //Тут посмотреть, сработает ли проброс в ErrorHandler
    return res.sendStatus(401);
    }
};