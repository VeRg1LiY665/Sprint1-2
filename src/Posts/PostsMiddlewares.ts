import {db} from "../db/db";
import {body, validationResult} from "express-validator";
import {Request,Response, NextFunction} from "express";
import {PostDBType} from "../Data Types/PostDBType";
import {BlogDBType} from "../Data Types/BlogDBType";


export const PostTitleValidation =body ('title').trim().isLength({min:1, max:30})

export const PostShortDescriptionValidation =body ('shortDescription').isLength({min:1, max:100})

export const PostContentValidation = body ('content').isLength({min:1,max:1000})

export const BlogIdValidation = body('blogId').custom(value => {
    const existingId = db.blogs.find((c:BlogDBType)=>c.id=== value.id);
    if (!existingId) {
        throw new Error('Blog ID does not exist');
    }
})

export const InputValidationMiddleware = (req:Request, res: Response, next:NextFunction) => {
    const result = validationResult(req).array({ onlyFirstError: true });
    if (result) {
        res.send({ errors: result });
        return;
    }
    else {next()}
}