import {ObjectId} from "mongodb";

export class ReqDBType {
    constructor (
        public _id: ObjectId,
        public ip : string,
        public URL: string,
        public date:Date
    ) {}
}

/*
export type ReqDBType = {
    _id: ObjectId,
    ip: string,
    URL: string,
    date:Date
}*/
