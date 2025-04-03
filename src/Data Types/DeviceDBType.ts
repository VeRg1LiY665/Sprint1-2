import {ObjectId} from "mongodb";

export type DeviceDBType = {
    _id: ObjectId;  //deviceId
    userId: ObjectId;
    ip: string;
    title: string;
    iat: number;
    exp: number;
}