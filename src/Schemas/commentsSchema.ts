import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {CommentDBType} from "../Data Types/CommentDBType";

export const commentsSchema = new mongoose.Schema<CommentDBType>({
    _id: ObjectId,
    content: String,
    commentatorInfo: {
        userId:ObjectId,
        userLogin:String,
    },
    postID: ObjectId,
    createdAt: String
})