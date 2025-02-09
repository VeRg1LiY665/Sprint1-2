import {body, param, ValidationChain, validationResult} from "express-validator";
import {Request,Response,NextFunction} from "express";



export const BlogNameValidation:ValidationChain =body ('name').trim().isLength({min:1, max:15}).withMessage(
    {message: 'Name length should be within 1 to 15 characters',field: 'name'})

export const BlogDescriptionValidation:ValidationChain =body ('description').trim().isLength({min:1, max:500}).withMessage(
    {message: 'Description length should be within 1 to 500 characters',field: 'description'})

export const BlogUrlLengthValidation:ValidationChain =body ('websiteUrl').trim().isLength({min:1, max:100}).withMessage(
    {message: 'WebsiteUrl length should be within 1 to 500 characters',field: 'websiteUrl'})

export const BlogUrlValidation:ValidationChain =body ('websiteUrl').matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage(
    {message: 'Not a valid URL',field: 'websiteUrl'})

/*export const IdValidation:ValidationChain = param('id').custom(value => {
    const existingId = db.blogs.find((c:BlogDBType)=>c.id=== value.id);
    if (!existingId) {
        throw new Error('Blog ID does not exist');
    }
})*/

export const ErrorCollectionMiddleware = (req:Request, res: Response, next:NextFunction) => {
    const errors = validationResult(req).formatWith(({msg}) => msg).array({ onlyFirstError: true });
    if (errors.length) {
        res.status(400).json({ errorsMessages: errors });
        return;
    }
    else {next()}
}