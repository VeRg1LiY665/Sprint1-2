import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {PostDBType} from "../Data Types/PostDBType";

export const postsSchema = new mongoose.Schema<PostDBType>({
    _id: ObjectId,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String
})