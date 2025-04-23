import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {NewestLike, PostDBType} from "../Data Types/PostDBType";

export const postsSchema = new mongoose.Schema<PostDBType>({
    _id: ObjectId,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String,
    extendedLikesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String,
        newestLikes: [new mongoose.Schema<NewestLike>({
            addedAt: String,
            userId: String,
            login: String
        }, { _id: false })]  //no _id option since mongoose adds it by default, and we don't need it
    }
})