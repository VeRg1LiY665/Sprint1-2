import {Request, Response, NextFunction} from "express";
import {AuthServices} from "../Services/AuthService";
import {container} from "../../composition-root";


export const accessTokenGuard= async (
    req: Request,
    res: Response,
    next: NextFunction
):Promise <any> => {
    if (!req.headers.authorization)
        return res.sendStatus(401);
try {
    const authServices = container.get(AuthServices);  //Сервис-локатор?  TODO спросить на сапорте как тут быть, guard инвокается до создания сервиса
    const result = await authServices.checkAccessToken(req.headers.authorization);
    res.locals.user = result;
    return next();
    }

catch (err) {
   // next(err); //Тут посмотреть, сработает ли проброс в ErrorHandler
    return res.sendStatus(401);
    }
};