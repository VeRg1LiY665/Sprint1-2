import {ObjectId} from "mongodb";

export class DeviceDBType {
    constructor(
    public _id: ObjectId,  //deviceId
    public userId: ObjectId,
    public ip: string,
    public title: string,
    public iat: number,
    public exp: number
    ) {}
}

/*
export type DeviceDBType = {
    _id: ObjectId;  //deviceId
    userId: ObjectId;
    ip: string;
    title: string;
    iat: number;
    exp: number;
}*/
