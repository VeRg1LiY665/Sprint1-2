import {body, query, ValidationChain, validationResult} from "express-validator";
import {Request,Response,NextFunction} from "express";
import mongoose from "mongoose";

export const BlogNameValidation:ValidationChain =body ('name').trim().isLength({min:1, max:15}).withMessage(
    {message: 'Name length should be within 1 to 15 characters',field: 'name'})

export const BlogDescriptionValidation:ValidationChain =body ('description').trim().isLength({min:1, max:500}).withMessage(
    {message: 'Description length should be within 1 to 500 characters',field: 'description'})

export const BlogUrlLengthValidation:ValidationChain =body ('websiteUrl').trim().isLength({min:1, max:100}).withMessage(
    {message: 'WebsiteUrl length should be within 1 to 500 characters',field: 'websiteUrl'})

export const BlogUrlValidation:ValidationChain =body ('websiteUrl').matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage(
    {message: 'Not a valid URL',field: 'websiteUrl'})

export const BlogQueryPageNumberValidation =query('pageNumber').isInt().withMessage(
    {message: 'Not a valid pageNumber',field: 'pageNumber'})

export const BlogQueryPageSizeValidation =query('pageSize').isInt().withMessage(
    {message: 'Not a valid pageSize',field: 'pageSize'})

export const BlogQuerySortByValidation =query('pageSize').isString().withMessage(
    {message: 'Not a valid sortBy',field: 'sortBy'})

export const BlogQuerySortDirectionValidation =query('sortDirection').custom((value:string) =>{
    if (value !== 'ascending' || 'descending' || 'asc' || 'desc' || 1 || -1) {throw new Error()}
}).withMessage(
    {message: 'Not a valid sortDirection',field: 'sortDirection'})

export const ErrorCollectionMiddleware = (req:Request, res: Response, next:NextFunction) => {
    const errors = validationResult(req).formatWith(({msg}) => msg).array({ onlyFirstError: true });
    if (errors.length) {
        res.status(400).json({ errorsMessages: errors });
        return;
    }
    else {next()}
}
export const ObjectIdValidationMiddleware = (req:Request, res: Response, next:NextFunction) => {
    if (!mongoose.isValidObjectId(req.params.id))
    {res.status(400).json('Not valid ObjectID');return}
    else next()
}