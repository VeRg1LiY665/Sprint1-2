import {ObjectId} from "mongodb";

export class LikesDBType{
    constructor(
    public _id: ObjectId,
    public status: string,
    public userId: string,
    public parentId: string,
    public commentId: string,
    public postId: string,  //для лайков на посты
    public addedAt: string //для лайков на посты
    )
    {}
}

