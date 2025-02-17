import {body, validationResult} from "express-validator";
import {Request,Response, NextFunction} from "express";
import {blogsCollection} from "../db/mongoDB";
import mongoose from "mongoose";
import {ObjectId} from "mongodb";



export const PostTitleValidation =body ('title').trim().isLength({min:1, max:30}).withMessage(
    {message: 'Title length should be within 1 to 30 characters',field: 'title'})

export const PostShortDescriptionValidation =body ('shortDescription').trim().isLength({min:1, max:100}).withMessage(
    {message: 'shortDescription length should be within 1 to 100 characters',field: 'shortDescription'})

export const PostContentValidation = body ('content').trim().isLength({min:1,max:1000}).withMessage(
    {message: 'content length should be within 1 to 1000 characters',field: 'content'})

export const BlogIdValidation = body('blogId').custom(async (value:string) => {
    const _id = new ObjectId(value)
    const foundBlog = await blogsCollection.findOne({_id : _id})
    if(!foundBlog){throw new Error()}

}).withMessage({message: 'Incorrect Blog ID',field: 'blogId'})


export const InputValidationMiddleware = (req:Request, res: Response, next:NextFunction) => {
    const result = validationResult(req).formatWith(({msg}) => msg).array({ onlyFirstError: true });
    if (result.length>0) {
        res.status(400).json({ errorsMessages: result });
        return;
    }
    else {next()}
}
export const BlogIdValidationMiddleware = async (req:Request, res: Response, next:NextFunction) => {
    if (!mongoose.isValidObjectId(req.body.blogId))
    {    if (!await blogsCollection.findOne({_id : new ObjectId(req.body.blogId)}))
    {res.status(400).json('BlodId is incorrect');return}
        next()
    }
    else next()
}
