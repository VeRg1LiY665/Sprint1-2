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
    ){}
}

/*
export type CommentDBType = {
    _id: ObjectId;
    content: string;
    commentatorInfo: {
        userId:ObjectId;
        userLogin:string;
    }
    postID: ObjectId;
    createdAt: string;
}*/
