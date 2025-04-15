import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {LikesDBType} from "../Data Types/LikesDBType";

export const likesSchema = new mongoose.Schema<LikesDBType>({
    _id: ObjectId,
    status: {
        type: String,
        enum: {
            values: ['Like', 'Dislike', 'None'],
            message: '{VALUE} is not supported'   //TODO проверить упадет ли message в ErrorHandler
        }
    },
    userId: String,
    parentId: String,
})