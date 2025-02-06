import {body, validationResult} from "express-validator";
import {Request,Response,NextFunction} from "express";
import {db} from "../db/db";
import {BlogDBType} from "../Data Types/BlogDBType";


export const BlogNameValidation =body ('name').trim().isLength({min:1, max:15})

export const BlogDescriptionValidation =body ('description').isLength({min:1, max:500})

export const BlogUrlLengthValidation =body ('websiteUrl').isLength({min:1, max:100})

export const BlogUrlValidation =body ('websiteUrl').matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)

export const IdValidation = body('id').custom(value => {
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