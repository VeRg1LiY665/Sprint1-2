import {body, query, validationResult} from "express-validator";
import {Request,Response, NextFunction} from "express";
import {blogsCollection} from "../../db/mongoDB";
import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export const PostTitleValidation =body ('title').trim().isLength({min:1, max:30})
    .withMessage('Title length should be within 1 to 30 characters')

export const PostShortDescriptionValidation =body ('shortDescription').trim().isLength({min:1, max:100})
    .withMessage('shortDescription length should be within 1 to 100 characters')

export const PostContentValidation = body ('content').trim().isLength({min:1,max:1000})
    .withMessage('content length should be within 1 to 1000 characters')

/*export const BlogIdValidation = body('blogId').custom(async (value:string) => {
    const _id = new ObjectId(value)
    const foundBlog = await blogsCollection.findOne({_id : _id})
    if(!foundBlog){throw new Error()}
}).withMessage('Incorrect Blog ID')*/

export const PostQueryPageNumberValidation =query('pageNumber').optional().isInt()
    .withMessage('Not a valid pageNumber')

export const PostQueryPageSizeValidation =query('pageSize').optional().isInt()
    .withMessage('Not a valid pageSize')

export const PostQuerySortByValidation =query('pageSize').optional().isString()
    .withMessage('Not a valid sortBy')

export const PostQuerySortDirectionValidation =query('sortDirection').optional().custom((value:string) =>{
    if (value !== 'ascending' && value !=='descending' && value !=='asc' && value !=='desc' && value !== '1' && value !=='-1' ) {throw new Error()}
    return true
}).withMessage('Not a valid sortDirection')

/*export const InputValidationMiddleware = (req:Request, res: Response, next:NextFunction) => {
    const result = validationResult(req).formatWith(({msg}) => msg).array({ onlyFirstError: true });

    if (result.length>0) {
        res.status(400).json({ errorsMessages: result });
        return;
    }
    else {next()}
}*/

export const BlogIdValidationMiddleware = async (req:Request, res: Response, next:NextFunction) => {
    if (!mongoose.isValidObjectId(req.body.blogId))
    {    if (!await blogsCollection.findOne({_id : new ObjectId(req.body.blogId)}))
    {res.status(400).json('BlodId is incorrect');return}
      else  {next()}
    }
    else {next()}
}
