import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export const blogsSchema = new mongoose.Schema({
    _id: ObjectId,
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean
})