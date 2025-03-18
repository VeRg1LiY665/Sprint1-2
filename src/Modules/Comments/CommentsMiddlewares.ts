import {body} from "express-validator";
import {NextFunction, Request, Response} from "express";
import mongoose from "mongoose";


export const CommentContentValidation =body ('content').trim().isLength({min:20, max:300})
    .withMessage('Comment length should be within 20 to 300 characters')

export const IDValidationMiddleware = async (req:Request, res: Response, next:NextFunction) => {
    if (!mongoose.isValidObjectId(req.params.id))
    {res.status(400).send('Comment ID is not valid')}
    else  {next()}
}