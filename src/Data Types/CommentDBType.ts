import {ObjectId} from "mongodb";

export type CommentDBType = {
    _id: ObjectId;
    content: string;
    commentatorInfo: {
        userId:ObjectId;
        userLogin:string;
    }
    postID: ObjectId;
    createdAt: string;
}