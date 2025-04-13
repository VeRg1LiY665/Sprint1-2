import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export const likesSchema = new mongoose.Schema({
    _id: ObjectId,
    status: String,
    userId: String,
    parentId: String,
})