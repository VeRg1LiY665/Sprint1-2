import {injectable} from "inversify";
import {LikesServices} from "./LikesServices/LikesServices";
import {NextFunction, Request, Response} from "express";

@injectable()
export class LikesController {
    constructor(private likesServices:LikesServices)
    {}

    async CreateReactionForComment(req: Request, res: Response, next:NextFunction){
        try {
            const dto= {
                commentId:req.params.id,
                parentId:res.locals.user.userId,
                likeStatus:req.body.likeStatus
            }
            await this.likesServices.CreateReactionForComment(dto)

            res.sendStatus(204)
        }
        catch (err) {next(err)}
    }

    async CreateReactionForPost(req: Request, res: Response, next:NextFunction){
    try{
        const dto= {
            postId:req.params.id,
            parentId:res.locals.user.userId,
            likeStatus:req.body.likeStatus
        }

        await this.likesServices.CreateReactionForPost(dto)

        res.sendStatus(204)
    }
    catch (err) {next(err)}
    }
}