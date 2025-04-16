import {injectable} from "inversify";
import {LikesServices} from "./LikesServices/LikesServices";
import {NextFunction, Request, Response} from "express";

@injectable()
export class LikesController {
    constructor(private likesServices:LikesServices)
    {}

    async CreateReaction(req: Request, res: Response, next:NextFunction){
        try {
            const dto= {
                commentId:req.params.id,
                parentId:res.locals.user.id,
                likeStatus:req.body.likeStatus
            }

            await this.likesServices.CreateReaction(dto)
        }
        catch (err) {next(err)}
    }

}