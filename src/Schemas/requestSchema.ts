import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {ReqDBType} from "../Data Types/ReqDBType";

export const requestsSchema = new mongoose.Schema<ReqDBType>({
    _id: ObjectId,
    ip: String,
    URL: String,
    date:Date
})