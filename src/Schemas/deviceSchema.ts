import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {DeviceDBType} from "../Data Types/DeviceDBType";

export const devicesSchema = new mongoose.Schema<DeviceDBType>({
    _id: ObjectId,  //deviceId
    userId: ObjectId,
    ip: String,
    title: String,
    iat: Number,
    exp: Number
})