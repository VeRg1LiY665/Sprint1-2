import {body, ValidationChain, validationResult} from "express-validator";
import {Request,Response,NextFunction} from "express";

type ValidationResultError = {
    [string: string]: [string];
};

export const UserLoginOrEmailValidation:ValidationChain =body ('loginOrEmail').trim()
    .isString().withMessage('Login or Email is not string')

/*export const UserPasswordValidation:ValidationChain =body ('password').trim()
    .isString().withMessage('Password is not string')*/


/*
export const ErrorCollectionMiddleware = (req:Request, res: Response, next:NextFunction) => {
    const errors = validationResult(req).array({onlyFirstError: true})
    let mappedErrors: ValidationResultError = {}
    errors.forEach(
        error => {
            if (error.type === 'field') {           //обязательно проверка на field error, только для них существует path
                mappedErrors[error.path] = error.msg
            }
        })
    if (errors.length) {
        res.status(400).json({errorsMessages: mappedErrors});
        return;
    } else {
        next()
    }
}*/
