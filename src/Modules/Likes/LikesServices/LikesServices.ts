import {injectable} from "inversify";
import {LikesRepo} from "../LikesRepo/LikesRepo";

@injectable()
export class LikesServices {
    constructor (
protected likesRepo:LikesRepo
    ){}

    async CreateReaction(commentId:string){

    }
}