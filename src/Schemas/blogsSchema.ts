import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {BlogDBType} from "../Data Types/BlogDBType";

export const blogsSchema = new mongoose.Schema<BlogDBType>({
    _id: ObjectId,
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean
})