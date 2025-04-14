import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export const postsSchema = new mongoose.Schema({
    _id: ObjectId,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String
})