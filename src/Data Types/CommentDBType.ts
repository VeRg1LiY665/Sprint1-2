import {ObjectId} from "mongodb";

export class CommentDBType {
    constructor(
    public _id: ObjectId,
    public content: string,
    public commentatorInfo: {
        userId:ObjectId,
        userLogin:string,
    },
    public postID: ObjectId,
    public createdAt: string,
    public likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: string
    }
    ){}
}


