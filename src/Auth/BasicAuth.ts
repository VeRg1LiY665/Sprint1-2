import {Request, Response, NextFunction} from "express";
import {SETTINGS} from "../settings";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth:string|undefined = req.headers['authorization']
    if (!auth) {
        res.status(401).json({});
        return
    }
    const BaseBack = (Buffer.from(SETTINGS.LOGIN +':'+SETTINGS.PASS)).toString('base64');
    if (BaseBack!==auth.slice(6)) {
        res.status(401).json({});
        return
    }
next()

}