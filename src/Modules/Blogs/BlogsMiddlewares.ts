import {body, query, ValidationChain, validationResult} from "express-validator";
import {Request,Response,NextFunction} from "express";
import mongoose from "mongoose";

export const BlogNameValidation:ValidationChain =body ('name').trim().isLength({min:1, max:15})
    .withMessage('Name length should be within 1 to 15 characters')

export const BlogDescriptionValidation:ValidationChain =body ('description').trim().isLength({min:1, max:500})
    .withMessage('Description length should be within 1 to 500 characters')

export const BlogUrlLengthValidation:ValidationChain =body ('websiteUrl').trim().isLength({min:1, max:100})
    .withMessage('WebsiteUrl length should be within 1 to 500 characters')

export const BlogUrlValidation:ValidationChain =body ('websiteUrl').matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage('Not a valid URL')

export const BlogQueryPageNumberValidation =query('pageNumber').optional().isInt()
    .withMessage('Not a valid pageNumber')

export const BlogQueryPageSizeValidation =query('pageSize').optional().isInt()
    .withMessage('Not a valid pageSize')

export const BlogQuerySortByValidation =query('sortBy').optional().isString()
    .withMessage('Not a valid sortBy')

export const BlogQuerySortDirectionValidation =query('sortDirection').optional().custom((value:string) =>{
    if (value !== 'ascending' && value !=='descending' && value !=='asc' && value !=='desc' && value !== '1' && value !=='-1' ) {throw new Error()}
    return true
}).withMessage('Not a valid sortDirection')

/*export const ErrorCollectionMiddleware = (req:Request, res: Response, next:NextFunction) => {
    const errors = validationResult(req).formatWith(({msg}) => msg).array({ onlyFirstError: true });

    if (errors.length) {
        res.status(400).json({ errorsMessages: errors });
        return;
    }
    else {next()}
}*/
export const ObjectIdValidationMiddleware = (req:Request, res: Response, next:NextFunction) => {
    if (!mongoose.isValidObjectId(req.params.id))
    {res.status(400).json('Not valid ObjectID')
        return;}
    else {next()}
}