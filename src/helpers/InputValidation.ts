import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const ErrorCollectionMiddleware = (req:Request, res: Response, next:NextFunction) => {
    const errors = validationResult(req).array({onlyFirstError: true})
    const mappedErrors = errors.map(error => {
        if (error.type === 'field') {           //обязательно проверка на field error, только для них существует path
            return {field: error.path,
                message: error.msg}
        }
        return 'Cannot define PATH method'
    })
    if (errors.length>=1) {
        res.status(400).json({errorsMessages:mappedErrors});
        return;
    } else {
        next()
    }
}