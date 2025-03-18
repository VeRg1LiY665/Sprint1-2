import {body, query, ValidationChain, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import mongoose from "mongoose";

export const UserLoginValidation:ValidationChain =body ('login').trim()
    .isString().withMessage('Login is not string')
    .isLength({min:3, max:10}).withMessage('Login length should be within 3 to 10 characters')
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Not a valid login')

export const UserPasswordValidation:ValidationChain =body ('password').trim()
    .isString().withMessage('Password is not string')
    .isLength({min:6, max:20}).withMessage('Password length should be within 1 to 15 characters')

export const UserEmailValidation:ValidationChain =body ('email').trim()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Not valid email')

export const UserQueryPageNumberValidation =query('pageNumber').optional().isInt()
    .withMessage('Not a valid pageNumber')

export const UserQueryPageSizeValidation =query('pageSize').optional().isInt()
    .withMessage('Not a valid pageSize')

export const UserQuerySortByValidation =query('sortBy').optional().isString()
    .withMessage('Not a valid sortBy')

export const UserQuerySortDirectionValidation =query('sortDirection').optional().custom((value:string) =>{
    if (value !== 'ascending' && value !=='descending' && value !=='asc' && value !=='desc' && value !== '1' && value !=='-1' )
    {console.log('ошибка'); throw new Error()}
    return true
}).withMessage('Not a valid sortDirection')

export const ObjectIdValidationMiddleware = (req:Request, res: Response, next:NextFunction) => {
    if (!mongoose.isValidObjectId(req.params.id))
    {res.status(400).json('Not valid ObjectID');return}
    else next()}

/*export const ErrorCollectionMiddleware = (req:Request, res: Response, next:NextFunction) => {
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
}*/
