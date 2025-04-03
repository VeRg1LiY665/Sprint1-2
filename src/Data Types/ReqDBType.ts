import {ObjectId} from "mongodb";

export type ReqDBType = {
    _id: ObjectId,
    ip: string,
    URL: string,
    date:Date
}